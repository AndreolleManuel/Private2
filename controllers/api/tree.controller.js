// import { Op } from "sequelize";
import { httpStatusCodes, NotFoundError } from "../../utils/index.js";
import { getAllTrees, getTreeById } from "../../services/index.js";

export const treeController = {

  async getAllTrees(req, res) {
    const {campaign_id, sort} = req.query;
    const where = {};
    
    !isNaN(campaign_id) && campaign_id !== "" && (where.campaign_id = Number(campaign_id));
    // TRI
    let order = [["name", "DESC"]];
    if (sort) {
      if (sort === "asc") order = [["price", "ASC"]];
      if (sort === "desc") order = [["price", "DESC"]];
    }
    const trees = await getAllTrees(where, order);
    res.status(httpStatusCodes.OK).json({ trees });
  },

  async getLandingTrees(req, res) {
    const limit = 5; // Fixed limit for landing trees
    const trees = await getAllTrees({}, [["created_at", "DESC"]], limit);
    if (!trees) {
      throw new NotFoundError("No trees found");
    }
    res.status(httpStatusCodes.OK).json({ trees });
  },

  async getTreesByCampaignId(req, res) {
    const trees = await getAllTrees({ campaign_id: req.params.id }, [["id", "DESC"]]);
    res.status(httpStatusCodes.OK).json(trees);
  },

  async getTreeById(req, res) {
    const tree = await getTreeById(req.params.id);
    if (!tree) {
      throw new NotFoundError("Tree not found");
    }
    res.status(httpStatusCodes.OK).json({ tree });
  },
};