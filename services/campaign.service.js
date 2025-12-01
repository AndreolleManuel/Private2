import { Campaign, Tree, Country } from "../models/index.js";

export async function getAllCampaigns(where, order,limit) {
  const finalWhere = where && typeof where === "object" ? where : {};
  const finalOrder = Array.isArray(order) && order.length ? order : [["name", "ASC"]];
  const options = {
    where: finalWhere,
    include: [
      { model: Country, as: "country", attributes: ["name"] },
      { model: Tree, as: "trees", attributes: ["id", "name", "price", "quantity", "stock"] }
    ],
    order: finalOrder,
  };
  if (where && Object.keys(where).length > 0) {
    options.where = where;
  }
  if (typeof limit === "number" && limit > 0) {
    options.limit = limit;
  }
  return await Campaign.findAll(options);
}

export async function getCampaignById(id) {
  return await Campaign.findByPk(id, {
    include: [
      { model: Country, as: "country", attributes: ["name"] },
      { model: Tree, as: "trees", attributes: ["id", "name", "price", "quantity", "stock"] }
    ]
  });
}

export async function createCampaign(data) {
  return await Campaign.create(data);
}

export async function updateCampaign(id, data) {
  const campaign = await Campaign.findByPk(id);
  if (!campaign) {
    throw new Error("Campaign not found");
  }
  return await campaign.update(data);
}

export async function deleteCampaign(id) {
  const campaign = await Campaign.findByPk(id);
  if (!campaign) {
    throw new Error("Campaign not found");
  }
  return await campaign.destroy();
}

export async function getCampaignsForLandingPage() {
  return await Campaign.findAll({
    limit: 5,
    order: [["end_date", "DESC"]],
    include: [
      { model: Country, as: "country", attributes: ["name"] },
      { model: Tree, as: "trees", attributes: ["id", "name", "price", "quantity", "stock"] }
    ],
  });
}