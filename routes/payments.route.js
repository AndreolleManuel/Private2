import express from "express";
import { authenticate, validate } from "../middlewares/index.js";
import { paymentController } from "../controllers/api/index.js";
import { paymentSchema } from "../schemas/index.js";

export const paymentsRouter = express.Router();

// Route to create a payment intent
paymentsRouter.post("/create-payment-intent", authenticate, validate(paymentSchema), paymentController.createPaymentIntent);