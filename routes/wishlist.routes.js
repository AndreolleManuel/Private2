import express from "express";
import { wishlistController } from "../controllers/api/index.js";
import { authenticate, checkId, validateParams } from "../middlewares/index.js";
import { treeIdParamSchema, replaceWishlistSchema } from "../schemas/index.js";

export const wishlistRouter = express.Router();

wishlistRouter.use(authenticate);
wishlistRouter.get("/", wishlistController.getAll);
wishlistRouter.put("/", validateParams(replaceWishlistSchema), wishlistController.replaceTreeInWishlist);
wishlistRouter.get("/has/:tree_id", checkId, validateParams(treeIdParamSchema), wishlistController.hasTreeInWishlist);
wishlistRouter.post("/:tree_id", checkId, validateParams(treeIdParamSchema), wishlistController.addTreeToWishlist);
wishlistRouter.delete("/:tree_id", checkId, validateParams(treeIdParamSchema), wishlistController.removeTreeFromWishlist);
