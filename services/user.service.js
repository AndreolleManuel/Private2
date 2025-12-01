import { User, Role } from "../models/index.js";
import { NotFoundError } from "../utils/error.js";

export async function getUserByMail(mail) {
  return await User.findOne({ 
    where: { mail },
    include: [{ model: Role, as: "role", attributes: ["name"] }]
  });
};

export async function getAllUsers(where, order) {
  const finalWhere = where && typeof where === "object" ? where : {};
  const finalOrder = Array.isArray(order) && order.length ? order : [["mail", "ASC"]];
  return await User.findAll({
    where: finalWhere,
    include: { model: Role, as: "role", attributes: ["name"] },
    order: finalOrder,
  });
};

export async function createUser(data) {
  return await User.create(data);
};

export async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return await user.update(data);
};

export async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return await user.destroy();
};

export async function getUserById(id) {
  return await User.findByPk(id, {
    include: { model: Role, as: "role", attributes: ["name"] }
  });
};