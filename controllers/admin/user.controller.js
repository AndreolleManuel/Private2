import argon2 from "argon2";
import { Op } from "sequelize";
import { NotFoundError } from "../../utils/index.js";
import { getAllUsers, getRoleByName, getUserByMail, createUser, getUserById, deleteUser, getAllRoles } from "../../services/index.js";

const isFilled = (v) => v !== undefined && v !== null && String(v).trim() !== "";
const isFilledNumber = (v) => isFilled(v) && Number.isFinite(Number(v));

const SORT_MAP = {
  mail_asc:      [["mail", "ASC"]],
  mail_desc:     [["mail", "DESC"]],
  lastname_asc:  [["lastname", "ASC"]],
  lastname_desc: [["lastname", "DESC"]],
};

export const userController = {

  // LIST USERS (FOR VIEW EJS)
  async getAllUsers(req, res) {
    const { successMessage, errorMessage } = req.query;
    const { q, role_id, city, sort } = req.query;
    const where = {};

    if (isFilled(q)) {
      const term = String(q).trim();
      where[Op.or] = [
        { mail:      { [Op.iLike]: `%${term}%` } },
        { firstname: { [Op.iLike]: `%${term}%` } },
        { lastname:  { [Op.iLike]: `%${term}%` } },
      ];
    }

    if (isFilledNumber(role_id)) {
      where.role_id = Number(role_id);
    }

    if (isFilled(city)) {
      where.city = { [Op.iLike]: `%${String(city).trim()}%` };
    }

    const order = SORT_MAP[sort] || SORT_MAP.mail_asc;

    try {
      const [users, roles] = await Promise.all([
        getAllUsers(where, order),
        getAllRoles(),
      ]);
      if (!users || users.length === 0) {
        const errorMessage = encodeURIComponent("Aucun utilisateur trouvé");
        return res.redirect(`/admin?errorMessage=${errorMessage}`);
      }
      res.render("manageUsers", {
        title: "Gestion des utilisateurs - GreenRoots",
        users,
        roles,
        successMessage,
        errorMessage,
      });
    } catch (error) {
      console.error("Erreur dans listUsers :", error);
      const errorMessage = encodeURIComponent("Erreur serveur");
      return res.redirect(`/admin?errorMessage=${errorMessage}`);
    }
  },

  // CREATE USER
  async createUser(req, res) {
    const { mail, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
      const errorMessage = encodeURIComponent("Les mots de passe ne correspondent pas");
      return res.redirect(`/admin/users?errorMessage=${errorMessage}`);
    }

    // check if email exists
    const existingUser = await getUserByMail(mail);
    if (existingUser) {
      const errorMessage = encodeURIComponent("Un compte existe déjà avec cet e-mail");
      return res.redirect(`/admin/users?errorMessage=${errorMessage}`);
    }

    const roleRecord = await getRoleByName(role);
    if (!roleRecord) {
      const errorMessage = encodeURIComponent("Rôle non trouvé");
      return res.redirect(`/admin/users?errorMessage=${errorMessage}`);
    }
    const hashedPassword = await argon2.hash(password);
    try {
      await createUser({ mail, password: hashedPassword, role_id: roleRecord.id });
      const successMessage = encodeURIComponent(`Utilisateur "${mail}" créé avec succès`);
      return res.redirect(`/admin/users?successMessage=${successMessage}`);
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      const errorMessage = encodeURIComponent("Erreur serveur");
      return res.redirect(`/admin/users?errorMessage=${errorMessage}`);
    }
  },

  // UPDATE USER
  async updateUser(req, res) {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (!user) {
      const errorMessage = encodeURIComponent("Utilisateur non trouvé");
      return res.redirect(`/admin/users?errorMessage=${errorMessage}`);
    }
    const { mail, role } = req.body;
    const updates = {};

    if (mail) updates.mail = mail;
    if (role) {
      const roleRecord = await getRoleByName(role);
      if (!roleRecord) {
        const errorMessage = encodeURIComponent("Rôle non trouvé");
        return res.redirect(`/admin/users?errorMessage=${errorMessage}`);
      }
      updates.role_id = roleRecord.id;
    };
    await user.update(updates);
    const successMessage = encodeURIComponent(`Utilisateur "${mail}" mis à jour avec succès`);
    return res.redirect(`/admin/users?successMessage=${successMessage}`);
  },

  // DELETE USER
  async deleteUser(req, res) {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (!user) throw new NotFoundError("Utilisateur non trouvé");
    await deleteUser(userId);
    const successMessage = encodeURIComponent("Utilisateur supprimé avec succès");
    return res.redirect(`/admin/users?successMessage=${successMessage}`);
  },

};