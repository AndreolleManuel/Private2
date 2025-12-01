import {  getAllCountries, createCountry } from "../../services/index.js";

export const countryController = {
  // List all countries
  async getAllCountries(req, res) {
    try {
      const countries = await getAllCountries();
      res.render("manageCountries", { countries, title : "Gérer les pays - GreenRoots", successMessage: req.query.successMessage, errorMessage: req.query.errorMessage });
    } catch (error) {
      const errorMessage = encodeURIComponent("Erreur lors de la récupération des pays: " + error.message);
      res.redirect(`/admin/countries?errorMessage=${errorMessage}`);
    }
  },

  // Show form to create a new country
  showCreateCountry(req, res) {
    res.render("createCountry", { title : "Créer un pays", errorMessage: req.query.errorMessage });
  },

  // Handle creation of a new country
  async createCountry(req, res) {
    try {
      const { name } = req.body;
      await createCountry({ name });
      const successMessage = encodeURIComponent("Pays créé avec succès");
      res.redirect(`/admin/countries?successMessage=${successMessage}`);
    } catch (error) {
      const errorMessage = encodeURIComponent("Erreur lors de la création du pays: " + error.message);
      res.redirect(`/admin/countries/create?errorMessage=${errorMessage}`);
    }
  },
};