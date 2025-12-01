import { User, Tree, sequelize } from "../models/index.js";
import { ValidationError } from "../utils/error.js";
import { NotFoundError } from "../utils/index.js";

export async function getUserWishlistByMail(userMail) {
  const user = await User.findOne({
    where: { mail: userMail },
    include: [{ model: Tree, as: "wishlist" }],
  });
  if (!user) {
    throw NotFoundError("User not found");
  }
  return user.wishlist.map(t => t.id);
}

export async function addToWishlist(userMail, treeId) {
  const [user, tree] = await Promise.all([
    User.findOne({ where: { mail: userMail } }),
    Tree.findByPk(treeId),
  ]);
  if (!user) {
    throw NotFoundError("User not found");
  }
  if (!tree) {
    throw NotFoundError("Tree not found");
  }
  await user.addWishlist(tree);
  return true;
}

export async function removeFromWishlist(userMail, treeId) {
  const [user, tree] = await Promise.all([
    User.findOne({ where: { mail: userMail } }),
    Tree.findByPk(treeId),
  ]);
  if (!user) {
    throw NotFoundError("User not found");
  }
  if (!tree) {
    throw NotFoundError("Tree not found");
  }
  await user.removeWishlist(tree); 
  return true;
}

export async function replaceWishlist(userMail, treeIds) {
  return await sequelize.transaction(async (t) => {
    const user = await User.findOne({ where: { mail: userMail }, transaction: t });
    if (!user) {
      throw NotFoundError("User not found");
    }
    const trees = await Tree.findAll({
      where: { id: treeIds.length ? treeIds : [null] },
      transaction: t
    });

    if (trees.length !== treeIds.length) {
      const foundIds = new Set(trees.map(t => t.id));
      const missing = treeIds.filter(id => !foundIds.has(id));
      throw new ValidationError("Some tree IDs do not exist", { missing });
    }
    await user.setWishlist(trees, { transaction: t });
    return true;
  });
}

export async function isTreeInWishlist(userMail, treeId) {
  const user = await User.findOne({ where: { mail: userMail } });
  if (!user) {
    throw NotFoundError("User not found");
  }
  const count = await sequelize.models.user_wishlist.count({
    where: { user_id: user.id, tree_id: treeId },
  });
  return count > 0;
}
