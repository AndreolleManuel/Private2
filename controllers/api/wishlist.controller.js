import { httpStatusCodes } from "../../utils/http-status-code.js";
import {getUserWishlistByMail, addToWishlist, removeFromWishlist, replaceWishlist, isTreeInWishlist } from "../../services/index.js";

export const wishlistController = {
  async getAll(req, res) {
    const ids = await getUserWishlistByMail(req.user.mail);
    res.status(httpStatusCodes.OK).json(ids);
  },

  async addTreeToWishlist(req, res) {
    const treeId = req.params.tree_id;
    await addToWishlist(req.user.mail, treeId);
    return res.status(httpStatusCodes.CREATED).json({ message: "Added to wishlist" });
  },

  async removeTreeFromWishlist(req, res) {
    await removeFromWishlist(req.user.mail, req.params.tree_id);
    return res.status(httpStatusCodes.NO_CONTENT).send();
  },

  async replaceTreeInWishlist(req, res) {
    await replaceWishlist(req.user.mail, req.body.tree_ids);
    return res.status(httpStatusCodes.OK).json({ message: "Wishlist replaced" });
  },

  async hasTreeInWishlist(req, res) {
    const present = await isTreeInWishlist(req.user.mail, req.params.tree_id);
    return res.status(httpStatusCodes.OK).json({ present });
  },
};