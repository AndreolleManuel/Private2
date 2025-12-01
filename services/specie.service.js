import { Specie } from "../models/index.js";
import { NotFoundError } from "../utils/error.js";

export async function getAllSpecies() {
  return await Specie.findAll();
}

export async function getSpecieById(id) {
  return await Specie.findByPk(id);
}

export async function createSpecie(data) {
  return await Specie.create(data);
}

export async function updateSpecie(id, data) {
  const specie = await Specie.findByPk(id);
  if (!specie) {
    throw new NotFoundError("Specie not found");
  }
  return await specie.update(data);
}

export async function deleteSpecie(id) {
  const specie = await Specie.findByPk(id);
  if (!specie) {
    throw new NotFoundError("Specie not found");
  }
  return await specie.destroy();
}