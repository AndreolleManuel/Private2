import jwt from "jsonwebtoken";

import { User, Role } from "../models/index.js";
import { ForbiddenError, NotFoundError } from "../utils/index.js";

// middleware to authenticate requests

export function authenticate (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ForbiddenError("Authentication failed, please log in with a valid user token");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    throw new ForbiddenError("Invalid token");
  }
  req.user = decoded;
  next();
}

// middleware to authorize admin users

export function isAllowed (requiredRole) {
  return async (req, res, next) => {
    const user = await User.findOne({ 
      where: { username: req.user.username }, 
      include: { 
        model: Role, 
        as: "role" 
      } 
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (user.role.name === "admin") {
      return next();
    }
    if (user.role.name !== requiredRole) {
      throw new ForbiddenError("Access denied");
    }
    next();
  };
}