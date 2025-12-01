import { getOrderDetails, createOrderLine, getAllOrders, getTreeById, createOrder, getOrderByPaymentIntent, getOrderLineByOrderId } from "../../services/index.js";
import { httpStatusCodes, NotFoundError, BadRequestError } from "../../utils/index.js";

export const orderController = {
  
  // Method to add an order line
  async addOrderLine(req, res) {
    const orderId = req.params.id;
    const { tree_id, quantity } = req.body;

    const order = await getOrderDetails(orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    const tree = await getTreeById(tree_id);
    if (!tree) {
      throw new NotFoundError("Tree not found");
    }
    if (tree.quantity < quantity) {
      throw new BadRequestError("Insufficient stock for the requested tree", { id: tree.id, quantity: tree.quantity });
    }

    const unit_price = tree.price;
    const total_price = unit_price * quantity;

    const orderLine = await createOrderLine({
      tree_name: tree.name,
      quantity,
      unit_price,
      total_price,
      order_id: order.id,
      tree_id: tree.id
    });

    // Update the total price of the order
    order.total_price += total_price;
    await order.save();

    //Update tree quantity
    tree.quantity -= quantity;
    await tree.save();

    res.status(httpStatusCodes.CREATED).json({ orderLine });
  },

  // Method to get all orders
  async getAllOrders(req, res) {
    const orders = await getAllOrders();
    res.status(httpStatusCodes.OK).json(orders);
  },

  // Method to get an order by ID
  async getOrderById(req, res) {
    const orderId = req.params.id;
    const order = await getOrderDetails(orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    res.status(httpStatusCodes.OK).json(order);
  },

  // Method to get order lines by order ID
  async getOrderLines(req, res) {
    const orderId = req.params.id;
    const order = await getOrderDetails(orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    // res.status(httpStatusCodes.OK).json({ order });
    res.status(httpStatusCodes.OK).json(order.order_lines);
  },


  // Method to create a new empty order
  async createOrder(req, res) {
    // const orderId = req.params.id;
    const { user_id } = req.body;

    // create new Order with total_price = 0
    const order = await createOrder({
      user_id,
      total_price: 0
    });

    res.status(httpStatusCodes.CREATED).json(order);
  },

  // Method to check if an order is validated by payment intent
  async orderIsValidated(req, res) {
    const paymentIntentId = req.params.paymentIntentId;
    const userId = req.user.id;
    const order = await getOrderByPaymentIntent(paymentIntentId, userId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    res.status(httpStatusCodes.OK).json({ order });
  },

  // Method to update a line (ex: change quantity)
  async updateOrderLine(req, res) {
    const orderId = req.params.id;
    const lineId = req.params.lineId;
    const { quantity } = req.body;

    const orderLine = await getOrderLineByOrderId(lineId, orderId);
    if (!orderLine) {
      throw new NotFoundError("Order line not found");
    }

    const tree = await getTreeById(orderLine.tree_id);
    if (!tree) {
      throw new NotFoundError("Tree not found");
    }

    // update quantity
    const diff = quantity - orderLine.quantity;

    if (diff > 0 && tree.quantity < diff) {
      throw new BadRequestError("Insufficient stock for the requested update", { id: tree.id, quantity: tree.quantity });
    }

    // update stock
    tree.quantity -= diff;
    await tree.save();

    // update order line
    orderLine.quantity = quantity;
    orderLine.total_price = orderLine.unit_price * quantity;
    await orderLine.save();

    // update order total price
    const order = await getOrderDetails(orderId);
    order.total_price = order.order_lines.reduce((sum, l) => sum + l.total_price, 0);
    await order.save();

    res.status(httpStatusCodes.OK).json(orderLine);
  }
};