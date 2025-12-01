import Joi from "joi";

export const treeIdParamSchema = Joi.object({
  tree_id: Joi.number().integer().positive().required(),
});

export const replaceWishlistSchema = Joi.object({
  tree_ids: Joi.array().items(Joi.number().integer().positive()).required(),
});