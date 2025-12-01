import Joi from "joi";

export const Campaign = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().allow("", null).optional(),
  begin_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().min(Joi.ref("begin_date")).required(),
  country_id: Joi.number().integer().positive().required(),
  tree: Joi.array().items(Joi.number().integer()).required(),
});

export const createCampaignSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  description: Joi.string().min(2).max(500).trim().allow("", null),
  begin_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().min(Joi.ref("begin_date")).required(),
  country_id: Joi.number().integer().positive().required(),
  image: Joi.string().allow(null, ""),
  image_url: Joi.string().uri().allow(null, ""),
});


export const updateCampaignSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().min(2).max(500),
  begin_date: Joi.date().iso(),
  country_id: Joi.number().integer().positive(),
  end_date: Joi.date().iso().min(Joi.ref("begin_date")),
  tree: Joi.array().items(Joi.number().integer()),
  image: Joi.string().allow(null, ""),
  image_url: Joi.string().uri().allow(null, ""),
}).or("name", "description", "begin_date","country_id", "end_date", "tree", "image", "image_url");
