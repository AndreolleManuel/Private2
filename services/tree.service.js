import { Tree, Specie, Campaign } from "../models/index.js";
import { NotFoundError } from "../utils/error.js";

export async function getAllTrees(where, sort, limitNum) {
  const finalWhere = where && typeof where === "object" ? where : {};
  const finalOrder = Array.isArray(sort) && sort.length ? sort : [["name", "ASC"]];
  const options = {
    where: finalWhere,
    include: [
      { model: Specie, as: "specie", attributes: ["id","name", "description"] },
      { model: Campaign, as: "campaign", attributes: ["id","name"] }
    ],
    order: finalOrder,
  };
  if (where && Object.keys(where).length > 0) {
    options.where = where;
  }
  if (typeof limitNum === "number" && limitNum > 0) {
    options.limit = limitNum;
  }

  return await Tree.findAll(options);
}


export async function getTreeById(id) {
  return await Tree.findByPk(id, {
    include: [
      { model: Specie, as: "specie", attributes: ["name", "description"] },
      { model: Campaign, as: "campaign", attributes: ["name"] }
    ],
  });
};

export async function updateTree(id, data) {
  const tree = await Tree.findByPk(id);
  if (!tree) {
    throw new NotFoundError("Tree not found");
  }
  return await tree.update(data);
}

export async function deleteTree(id) {
  const tree = await Tree.findByPk(id);
  if (!tree) {
    throw new NotFoundError("Tree not found");
  }
  return await tree.destroy();
}

export async function createTree(data) {
  return await Tree.create(data);
}
