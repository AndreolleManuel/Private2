import express from "express";
import { userController } from "../controllers/api/index.js";
import { authenticate, validate, checkId, sensitiveLimiter } from "../middlewares/index.js";
import { updateUserPasswordSchema, updateUserSchema } from "../schemas/index.js";

export const userRouter = express.Router();

userRouter.get("/", userController.getAllUsers);

// route to retrieve the connected user's information
userRouter.post("/", userController.createUser);

userRouter.get("/me", authenticate, userController.getCurrentUser);

// route to update the connected user's information
userRouter.patch("/me", authenticate, validate(updateUserSchema), userController.updateCurrentUser);

userRouter.delete("/me", authenticate, userController.deleteCurrentUser);
// route to update the connected user's password
userRouter.patch("/me/password", authenticate, sensitiveLimiter, validate(updateUserPasswordSchema), userController.updatePassword);
//route to retrieve the connected user's orders
userRouter.get("/me/orders", authenticate, userController.getUserOrders);
//route to retrieve a specific order of the connected user
userRouter.get("/me/orders/:id", authenticate, checkId,userController.getUserOrderById);
//route to get wishlist of the connected user
userRouter.get("/me/wishlist", authenticate, userController.getUserWishlist);
userRouter.get("/:id", checkId, userController.getUser);
userRouter.put("/:id", checkId, userController.updateUser);






//route to add a tree to the wishlist of the connected user
// userRouter.post("/me/wishlist/:treeId", authenticate, userController.addTreeToWishlist);

//route to remove a tree from the wishlist of the connected user
// userRouter.delete("/me/wishlist/:treeId", authenticate, userController.removeTreeFromWishlist);
