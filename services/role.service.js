import { Role } from "../models/index.js";

export async function getRoleByName(name) {
  return await Role.findOne({ where: { name } });
};

export async function getAllRoles() {
  return await Role.findAll();
};