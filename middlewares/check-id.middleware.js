import { BadRequestError } from "../utils/index.js";

export function checkId(req, res, next) {
  for (const param in req.params) {
    if (param.toLowerCase().includes("id")) {
      const id = parseInt(req.params[param], 10);
      if (isNaN(id) || id <= 0) {
        throw new BadRequestError("ID invalid");
      }
      req.params[param] = id;
    }
  }
  next();
}
