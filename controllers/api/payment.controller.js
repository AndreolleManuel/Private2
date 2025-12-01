import Stripe from "stripe";
import { Tree, PaymentIntentDraft } from "../../models/index.js";
import { httpStatusCodes, NotFoundError, ConflictError, BadRequestError } from "../../utils/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const paymentController = {
  // Controller to create a payment intent
  async createPaymentIntent(req, res) {
    // 1. Cart validation
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (!items.length) {
      throw new BadRequestError("No items provided");
    }

    // 2. Agrégation by tree_id 
    const aggregated = new Map();
    const invalid = [];

    for (const raw of items) {
      const id = Number(raw?.tree_id);
      const qty = Number(raw?.quantity);
      if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(qty) || qty <= 0) {
        invalid.push({ tree_id: raw?.tree_id, quantity: raw?.quantity });
        continue;
      }
      aggregated.set(id, (aggregated.get(id) ?? 0) + qty);
    }

    if (invalid.length) {
      throw new BadRequestError(`Invalid items payload: ${JSON.stringify(invalid)}`);
    }
    if (aggregated.size === 0) {
      throw new BadRequestError("No valid items to process");
    }

    // 3. Isolate unique IDs
    const uniqIds = [...aggregated.keys()];

    // 4. Retrieve trees from the database
    const trees = await Tree.findAll({
      where: { id: uniqIds },
    });

    // 5. Check for the presence of all trees (based on unique IDs)
    const foundIds = new Set(trees.map(t => Number(t.id)));
    const missing = uniqIds.filter(id => !foundIds.has(id));
    if (missing.length) {
      throw new NotFoundError(`Trees with IDs ${missing.join(", ")} not found`);
    }

    // 6. Check stock and calculate total 
    const byId = new Map(trees.map(t => [Number(t.id), t]));
    let totalAmount = 0;

    for (const [treeId, qty] of aggregated.entries()) {
      const tree = byId.get(treeId);
      const remaining = Number(tree.quantity ?? 0);
      if (!Number.isInteger(remaining) || remaining < qty) {
        throw new ConflictError(`Insufficient stock for tree ID ${treeId}`, { id: treeId, requested: qty, available: remaining });
      }
      totalAmount += tree.price * qty;
    }
    if (!Number.isInteger(totalAmount) || totalAmount <= 0) {
      throw new ConflictError("Invalid total amount", { totalAmount });
    }
    // 7. draft cart
    const snapshot = [];

    for (const [tree_id, quantity] of aggregated.entries()) {
      const tree = byId.get(tree_id);
      const unit_price = tree.price;
      snapshot.push({ tree_id, quantity, unit_price });
    }
    
    // 8. Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,            
      currency: "eur",
      //   automatic_payment_methods: { enabled: true },
      payment_method_types: ["card"],
      receipt_email: req.user?.mail || undefined,
      metadata: {
        userId: String(req.user?.id ?? ""),
      },
    });
    await PaymentIntentDraft.upsert({
      payment_intent_id: paymentIntent.id,
      user_id: req.user.id,
      amount: totalAmount,       
      items_json: snapshot,      
      status: "pending",
      order_id: null
    });
    console.log("[controller] writing draft:", {
      pi: paymentIntent.id,
      items_len: snapshot.length,
      first: snapshot[0]
    });
    
    return res
      .status(httpStatusCodes.CREATED)
      .json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  },
};