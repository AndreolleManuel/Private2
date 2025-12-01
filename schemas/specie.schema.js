import Joi from "joi";

export const createSpecieSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  description: Joi.string().min(2).max(500).trim()
});

export const updateSpecieSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim(),
  description: Joi.string().min(2).max(500).trim()
}).or("name", "description");
