import Joi from "joi";

export const OrderLine = Joi.object({
  tree_name: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  unit_price: Joi.number().min(0).required(),
  total_price: Joi.number().min(0).required(),
  order_id: Joi.number().integer().required(),
  tree_id: Joi.number().integer()
});