import { Order, OrderLine, User, PaymentIntentDraft, Tree } from "../models/index.js";
import { NotFoundError } from "../utils/error.js";

export async function getAllOrders(where, order, includeFilters) {
  const finalWhere = where && typeof where === "object" ? where : {};
  const finalOrder = Array.isArray(order) && order.length ? order : [["created_at", "DESC"]];
  const filters = includeFilters && typeof includeFilters === "object" ? includeFilters : {};
  const include = [
    {
      model: User,
      as: "user",
      attributes: ["id", "mail"],
      ...(filters.user ? { where: filters.user, required: true } : {}),
    },
    {
      model: OrderLine,
      as: "order_lines",
    },
    {
      model: PaymentIntentDraft,
      as: "payment_intent_draft",
      attributes: ["id", "status"],
      ...(filters.payment ? { where: filters.payment, required: true } : { required: false }),
    },
  ];
  return await Order.findAll({
    where: finalWhere,
    include,
    order: finalOrder
  });
};

export async function getOrderDetails(id) {
  const order = await Order.findByPk(id, {
    include: [
      { model: User, as: "user", attributes: ["mail", "firstname", "lastname", "address_number", "address_streetname", "postal_code", "city", "phone_number"] },
      { model: OrderLine, as: "order_lines", include: { model: Tree, as: "tree" } },
      { model: PaymentIntentDraft, as: "payment_intent_draft", attributes: ["status"] },
    ],
  });
  if (!order) throw new NotFoundError("Order not found");
  return order;
};

export async function createOrder(data) {
  return await Order.create(data);
};

export async function getOrderByPaymentIntent (paymentIntentId, userId) {
  return await Order.findOne({ 
    where: { payment_intent_id: paymentIntentId, user_id: userId },
    include: { model: OrderLine, as: "order_lines", include: { model: Tree, as: "tree" } }
  });
};