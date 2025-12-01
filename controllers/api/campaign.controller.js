import { getAllCampaigns, getCampaignById, getCampaignsForLandingPage } from "../../services/index.js";
import { httpStatusCodes, NotFoundError } from "../../utils/index.js";

export const campaignController = {
  // Controller method to get all campaigns
  async getAllCampaigns(req, res) {
    // Logic to fetch all campaigns from the database
    const limitFilter = req.query.limit ? Number(req.query.limit) : undefined;

    const campaigns = await getAllCampaigns(limitFilter);
    if (!campaigns) {
      throw new NotFoundError("No campaigns found");
    }
    res.status(httpStatusCodes.OK).json({ campaigns });
  },

  // Controller method to get a campaign by ID
  async getCampaignById(req, res) {
    const campaignId = req.params.id;
    // Logic to fetch a campaign by ID from the database
    const campaign =  await getCampaignById(campaignId);
    if (!campaign) {
      throw new NotFoundError("Campaign not found");
    }
    res.status(httpStatusCodes.OK).json({ campaign });
  },

  // Controller method to get a limited number of campaigns
  async getLandingCampaigns(req, res) {
    const campaigns = await getCampaignsForLandingPage();
    if (!campaigns) {
      throw new NotFoundError("No campaigns found");
    }
    res.status(httpStatusCodes.OK).json({ campaigns });
  },
};



