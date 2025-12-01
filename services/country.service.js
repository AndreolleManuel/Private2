import { Country } from "../models/index.js";
import { NotFoundError } from "../utils/error.js";

export async function getAllCountries() {
  return await Country.findAll();
}

export async function getCountryById(id) {
  return await Country.findByPk(id);
}

export async function createCountry(data) {
  return await Country.create(data);
}

export async function updateCountry(id, data) {
  const country = await Country.findByPk(id);
  if (!country) {
    throw new NotFoundError("Country not found");
  }
  return await country.update(data);
}

export async function deleteCountry(id) {
  const country = await Country.findByPk(id);
  if (!country) {
    throw new NotFoundError("Country not found");
  }
  return await country.destroy();
}
