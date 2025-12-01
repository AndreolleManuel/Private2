import { Router } from "express";
import { campaignController } from "../controllers/api/index.js";
import { checkId } from "../middlewares/index.js";

export const campaignRouter = Router();

// route to get all campaigns
campaignRouter.get ("/", campaignController.getAllCampaigns);

// route to get a limited number of campaigns for landing page
campaignRouter.get ("/landing", campaignController.getLandingCampaigns);

// route to get a campaign by ID
campaignRouter.get ("/:id", checkId, campaignController.getCampaignById);
