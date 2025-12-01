import Joi from "joi";

export const Order = Joi.object({
  order_number: Joi.string().required(),
  total_price: Joi.number().integer().required(),
  user_id: Joi.number().min(0).required(),
});