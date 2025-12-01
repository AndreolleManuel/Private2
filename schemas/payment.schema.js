import Joi from "joi";

export const paymentSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      tree_id: Joi.number().integer().positive().required(),
      quantity: Joi.number().integer().min(1).positive().required()
    })
  ).min(1).required(),
});
