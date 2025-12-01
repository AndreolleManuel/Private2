import express from "express";
import Stripe from "stripe";
import { ulid } from "ulidx";
import { sequelize, PaymentIntentDraft, Order, OrderLine, Tree } from "../models/index.js";
import { httpStatusCodes } from "../utils/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

function generateOrderNumber() {
  return `GR-${ulid()}`;
};

function normalizeItems(raw) {
  try {
    if (typeof raw === "string") raw = JSON.parse(raw);
  } catch (e) {
    return [];
  }
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    if (Array.isArray(raw.items)) return raw.items;
    if (Array.isArray(raw.snapshot)) return raw.snapshot;
    if (Array.isArray(raw.data)) return raw.data;
  }

  return [];
}


router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] signature error:", err.message, {
      hasSig: !!signature,
      bodyType: typeof req.body,
      bodyIsBuffer: Buffer.isBuffer(req.body),
      whsecConfigured: !!process.env.STRIPE_WEBHOOK_SECRET
    });
    return res.status(httpStatusCodes.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    try {
      const draft = await PaymentIntentDraft.findOne({ where: { payment_intent_id: intent.id } });
      if (!draft) {
        console.warn("[webhook] draft not found for PI", intent.id);
        return res.json({ received: true });
      } else {
        console.log(
          "[webhook] draft found:",
          {
            id: draft.id,
            user_id: draft.user_id,
            status: draft.status,
            items_json_type: typeof draft.items_json,
            isArray: Array.isArray(draft.items_json),
            items_len: Array.isArray(draft.items_json) ? draft.items_json.length : null
          }
        );
      }
      if (draft.status === "completed") {
        return res.json({ received: true });
      }
      const rawItems = draft.items_json;
      const items = normalizeItems(rawItems);
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Draft items_json is empty or invalid");
      }

      const sanitized = items
        .map(it => ({
          tree_id: Number(it.treeId ?? it.tree_id),
          quantity: Number(it.quantity ?? it.qty),
          unit_price: Number(it.unit_price ?? it.unitPrice)
        }))
        .filter(it =>
          Number.isInteger(it.tree_id) && it.tree_id > 0 &&
          Number.isInteger(it.quantity) && it.quantity > 0 &&
          Number.isInteger(it.unit_price) && it.unit_price > 0
        );

      if (sanitized.length === 0) {
        console.error("[webhook] no usable items in draft; skipping order creation");
        return res.json({ received: true });
      }

      // Process the order creation inside a transaction
      await sequelize.transaction(async (t) => {
        if (!Array.isArray(sanitized) || sanitized.length === 0) {
          throw new Error("No sanitized items to process");
        }
        // 1. create order
        const order = await Order.create({
          user_id: draft.user_id,
          order_number: generateOrderNumber(),
          total_price: draft.amount,
          payment_intent_id: draft.payment_intent_id
        }, { transaction: t });
        
        // 2. fetch tree names
        const treeIds = [...new Set(sanitized.map(it => it.tree_id))];
        const trees = await Tree.findAll({ 
          where: { id: treeIds }, 
          attributes: ["id", "name"], 
          transaction: t 
        });
        const namedById = new Map(trees.map(t => [Number(t.id), t.name ?? null]));

        // 3. create order_lines
        const lines = sanitized.map((it) => {
          const tree_name = namedById.get(it.tree_id) ?? "Unknown";
          const quantity   = it.quantity;
          const unit_price = it.unit_price;              // centimes
          const total_price = unit_price * quantity;

          return {
            order_id: order.id,
            tree_id: it.tree_id,
            tree_name,
            quantity,
            unit_price,
            total_price
          };
        });
        const badLines = lines.find(l =>
          l.tree_name == null ||
          l.quantity == null ||
          l.unit_price == null ||
          l.total_price == null ||
          l.order_id == null ||
          l.tree_id == null
        );
        if (badLines) {
          console.error("[webhook] invalid line payload:", badLines);
          throw new Error("Invalid order_line payload (null/undefined fields)");
        }
        console.log("[webhook] first line preview:", lines[0]);

        await OrderLine.bulkCreate(lines, { transaction: t });

        // 4. decrease stock
        for (const it of sanitized) {
          await Tree.decrement({ quantity: it.quantity }, { where: { id: it.tree_id }, transaction: t });
        }

        // 5. mark draft as completed
        await draft.update({ status: "completed", order_id: order.id }, { transaction: t });
      });

      return res.json({ received: true });
    } catch (e) {
      console.error("[webhook] handler error:", e);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ received: false });
    }
  }
});

export default router;
