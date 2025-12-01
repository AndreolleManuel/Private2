import { Router } from "express";
import { orderController } from "../controllers/api/index.js";
import { checkId, authenticate } from "../middlewares/index.js";

export const orderRouter = Router();

// All orders
orderRouter.get("/", orderController.getAllOrders);

// Create a new empty order
orderRouter.post("/", orderController.createOrder);

// Order isValidated?
orderRouter.get("/by-payment-intent/:paymentIntentId", authenticate, orderController.orderIsValidated);

// An order by ID
orderRouter.get("/:id", checkId, orderController.getOrderById);

// Get order lines for a specific order
orderRouter.get("/:id/lines", checkId, orderController.getOrderLines);

// Add an order line to a specific order
orderRouter.post("/:id/lines", checkId, orderController.addOrderLine);

// Update an order line (e.g., change quantity)
orderRouter.put("/:id/lines/:lineId", checkId, orderController.updateOrderLine);
