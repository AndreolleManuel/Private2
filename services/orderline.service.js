import { OrderLine } from "../models/index.js";

export async function createOrderLine(data) {
  return await OrderLine.create(data);
};

export async function getOrderLineByOrderId(id, orderId) {
  return await OrderLine.findAll({ where: { id, order_id: orderId } });
};
