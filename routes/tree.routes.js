import { Router } from "express";
import { treeController } from "../controllers/api/index.js";
import { checkId } from "../middlewares/index.js";

export const treeRouter = Router();

treeRouter.get("/", treeController.getAllTrees);
treeRouter.get("/landing", treeController.getLandingTrees);
treeRouter.get("/campaigns/:campaignId", treeController.getTreesByCampaignId);
treeRouter.get("/:id", checkId, treeController.getTreeById);
