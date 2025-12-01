import { Router } from "express";
import { authController } from "../controllers/api/index.js";
import { loginUserSchema, createUserSchema } from "../schemas/index.js";
import { validate, loginLimiter, sensitiveLimiter } from "../middlewares/index.js";

export const authRouter = Router();

// route to register
authRouter.post("/register", validate(createUserSchema), sensitiveLimiter, authController.registerUser);

// route for user authentication
authRouter.post("/login", validate(loginUserSchema), loginLimiter, authController.login);

