import { Router } from "express";
import { contactController } from "../controllers/api/index.js";
import { validate } from "../middlewares/index.js";
import { contactSchema } from "../schemas/index.js";

export const contactRouter = Router();

contactRouter.post("/", validate(contactSchema), contactController.sendMessage);