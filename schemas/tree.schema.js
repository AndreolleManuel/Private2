import Joi from "joi";

export const treeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  latin_name: Joi.string().min(2).max(100).required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().integer().min(0).required(),
  specie_id: Joi.number().integer().required(),
  campaign_id: Joi.number().integer().required(),
  image: Joi.string().allow(null, ""),
});

export const createTreeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  latin_name: Joi.string().min(2).max(100).allow(""),
  price: Joi.alternatives().try(Joi.number(), Joi.string().trim().pattern(/^\d+(?:[.,]\d{1,2})?$/)).required(),
  quantity: Joi.number().integer().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  specie_id: Joi.number().integer().positive().required(),
  campaign_id: Joi.number().integer().positive().required(), 
  image_url: Joi.string().uri().allow(""),
  image: Joi.any(), 
});

export const updateTreeSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  latin_name: Joi.string().min(2).max(100).allow(""),
  price: Joi.alternatives().try(Joi.number(), Joi.string().trim().pattern(/^\d+(?:[.,]\d{1,2})?$/)),
  quantity: Joi.number().integer().min(0),
  stock: Joi.number().integer().min(0),
  specie_id: Joi.number().integer().positive(),
  campaign_id: Joi.number().integer().positive(),
  image_url: Joi.string().uri().allow(""),
  image: Joi.any(),
}).or("name","latin_name","price","quantity","stock","specie_id","campaign_id","image_url","image");
