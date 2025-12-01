import { getUserByMail } from "../../services/index.js";
import argon2 from "argon2";

export const adminController = {
  index (req, res) {
    const successMessage = req.query.successMessage;
    const errorMessage = req.query.errorMessage;
    res.render("admin", { title: "Administration - Greenroots", successMessage, errorMessage });
  },

  async handleLogin(req, res) {
    const userData = req.body;
    try {
      const user = await getUserByMail(userData.mail);
      const isPasswordValid = user ? await argon2.verify(user.password, userData.password) : false;
      if (!user || !isPasswordValid || user.role.name !== "admin") {
        const errorMessage = encodeURIComponent("Identifiants invalides.");
        return res.redirect(`/admin/login?errorMessage=${errorMessage}`);
      }
      req.session.regenerate((error) => {
        if (error) {
          const errorMessage = encodeURIComponent("Une erreur est survenue lors de la connexion.");
          return res.redirect(`/admin/login?errorMessage=${errorMessage}`);
        }
        req.session.user = { id: user.id, mail: user.mail, isAdmin: user.role.name === "admin" };
        req.session.isAdmin = user.role.name === "admin";
        req.session.save();
        const successMessage = encodeURIComponent("Connexion réussie.");
        res.redirect(`/admin?successMessage=${successMessage}`);
      });
    } catch (error) {
      const errorMessage = encodeURIComponent("Une erreur est survenue lors de la connexion. " + error.message);
      return res.redirect(`/admin/login?errorMessage=${errorMessage}`);
    }
  },

  handleLogout(req, res) {
    req.session.destroy(() => {
      res.clearCookie("sessionId");
      res.redirect("/admin");
    });
  },

  showLogin(req, res) {
    const errorMessage = req.query.errorMessage;
    res.render("login", { title: "Connexion - Greenroots", errorMessage });
  },
};