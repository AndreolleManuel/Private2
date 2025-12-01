import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { User, Order, Tree, OrderLine } from "../../models/index.js";
import { getUserByMail, getTreeById, createUser, getAllUsers, getUserById } from "../../services/index.js";
import { httpStatusCodes, NotFoundError, BadRequestError } from "../../utils/index.js";

export const userController = {

  // Controller to add a tree to the connected user's wishlist
  async addTreeToWishlist(req, res) {
    const user = await getUserByMail(req.user.mail);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const tree = await getTreeById(req.params.id);
    if (!tree) {
      throw new NotFoundError("Tree not found");
    }
    await user.addTree(tree);
    res.status(httpStatusCodes.OK).json({ message: "Tree added to wishlist" });
  },
  
  // Controller to create a new user
  async createUser (req, res) {
    const user = await createUser(req.body);
    res.status(httpStatusCodes.CREATED).json({ user });
  },

  // Controller to delete a user
  async deleteCurrentUser (req, res) {
    const user = await getUserByMail(req.user.mail);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    await user.destroy();
    res.status(httpStatusCodes.NO_CONTENT).json({ message: "User deleted" });
  },

  // Controller to get all users
  async getAllUsers (req, res) {
    const users = await getAllUsers();
    res.status(httpStatusCodes.OK).json({ users });
  },
  
  // Controller to retrieve the connected user's information
  async getCurrentUser(req, res) {
    const user = await getUserByMail(req.user.mail);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(httpStatusCodes.OK).json({ user });
  },

  // Controller to get a user by ID
  async getUserById (req, res) {
    const user = await getUserById(req.params.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(httpStatusCodes.OK).json({ user });
  },
  
  // Controller to get a user by ID
  async getUser (req, res) {
    const user = await getUserById(req.params.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(httpStatusCodes.OK).json({ user });
  },
  
  // Controller to retrieve the connected user's orders
  async getUserOrders(req, res) {
    const user = await getUserByMail(req.user.mail);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const result = await Order.findAll({ 
      where: { user_id: user.id },
      include: { 
        model: OrderLine, 
        as: "order_lines",
        include: { 
          model: Tree, 
          as: "tree" 
        },
      },
      order: [["created_at", "DESC"], [{ model: OrderLine, as: "order_lines" }, "id", "ASC"]]
    });
    if (!result) {
      throw new NotFoundError("User not found");
    }
    res.status(httpStatusCodes.OK).json({ orders: result });
  },

  // Controller to retrieve a specific order of the connected user
  async getUserOrderById(req, res) {
    const user = await getUserByMail(req.user.mail);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const order = await Order.findOne({ where: { id: req.params.id, user_id: user.id } });
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    res.status(httpStatusCodes.OK).json({ order });
  },
  
  // Controller to get wishlist of the connected user
  async getUserWishlist(req, res) {
    const user = await getUserByMail(req.user.mail);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const wishlist = await Tree.findAll({
      include: {
        model: User,
        as: "user",
        where: { id: user.id },
      },
    });
    res.status(httpStatusCodes.OK).json({ wishlist });
  },

  // Controller to remove a tree from the connected user's wishlist
  async removeTreeFromWishlist(req, res) {
    const user = await getUserByMail(req.user.mail);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const tree = await getTreeById(req.params.id);
    if (!tree) {
      throw new NotFoundError("Tree not found");
    }
    await user.removeTree(tree);
    res.status(httpStatusCodes.OK).json({ message: "Tree removed from wishlist" });
  },

  // Controller to update the connected user's information
  async updateCurrentUser(req, res) {
    const userData = req.body;
    const user = await getUserByMail(req.user.mail);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const oldMail = user.mail;
    await user.update(userData);
    if (userData.mail && userData.mail !== oldMail) {
      const newToken = jwt.sign({ mail: user.mail, role: user.role.name, id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.status(httpStatusCodes.OK).json({ user, token: newToken });
    }
    res.status(httpStatusCodes.OK).json({ user });
  },

  // Controller to update the connected user's password
  async updatePassword(req, res) {
    const userData = req.body;
    const newPassword = userData.new_password;
    const confirmPassword = userData.confirm_password;
    if (newPassword !== confirmPassword) {
      throw new BadRequestError("Passwords do not match", { field: "confirm_password"});
    }
    const user = await getUserByMail(req.user.mail);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const isPasswordValid = await argon2.verify(user.password, userData.current_password);
    if (!isPasswordValid) {
      throw new BadRequestError("Current password is incorrect", { field: "current_password" });
    }
    user.password = await argon2.hash(newPassword);
    const updatedUser = await user.save();
    const token = jwt.sign({ email : updatedUser.email, role : updatedUser.role.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(httpStatusCodes.OK).json({ message: "Password updated successfully", token });
  },

  // Controller to update user's informations
  async updateUser (req, res) {
    const user = await getUserById(req.params.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const updatedUser = await user.update(req.body);
    const token = jwt.sign({ email : updatedUser.email, role : updatedUser.role.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(httpStatusCodes.OK).json({ user: updatedUser, token });
  }
};