import Joi from "joi";
import { httpStatusCodes } from "../utils/index.js";


export const validate = (schema) => (req, res, next) => {
  try {
    Joi.attempt(req.body, schema, "Invalid data");
    next();
  } catch (error) {
    const messages = error.details ? error.details.map((err) => err.message) : [error.message];
    res.status(httpStatusCodes.BAD_REQUEST).json({ error: messages.join(", ") });
  }
};

export function validateParams(schema, opts = { convert: true, stripUnknown: true, abortEarly: false }) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, opts);
    if (error) {
      const messages = error.details?.map(d => d.message) ?? [error.message];
      return res.status(httpStatusCodes.BAD_REQUEST).json({ error: messages.join(", ") });
    }
    req.params = value;
    next();
  };
}