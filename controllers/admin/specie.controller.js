import { getAllSpecies, createSpecie, updateSpecie, getSpecieById } from "../../services/index.js";

export const specieController = {
  async createSpecie(req, res) {
    const { name, description } = req.body;
    if (!name || !description) {
      const errorMessage = encodeURIComponent("Tous les champs obligatoires doivent être remplis");
      return res.redirect(`/admin/species/create?errorMessage=${errorMessage}`);
    }
    const newSpecieData = { name, description };
    try {
      await createSpecie(newSpecieData);
      const successMessage = encodeURIComponent("Espèce créée avec succès");
      res.redirect(`/admin/species?successMessage=${successMessage}`);
    } catch (error) {
      const errorMessage = encodeURIComponent("Erreur lors de la création de l'espèce: " + error.message);
      res.redirect(`/admin/species/create?errorMessage=${errorMessage}`);
    }
  },

  async editSpecie(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    const specie = await getSpecieById(id);
    if (!specie) {
      const errorMessage = encodeURIComponent("Espèce non trouvée");
      return res.redirect(`/admin/species/edit/${id}?errorMessage=${errorMessage}`);
    }
    const updatedData = { name, description };
    try {
      await updateSpecie(id, updatedData);
      const successMessage = encodeURIComponent("Espèce mise à jour avec succès");
      res.redirect(`/admin/species?successMessage=${successMessage}`);
    } catch (error) {
      const errorMessage = encodeURIComponent("Erreur lors de la mise à jour de l'espèce: " + error.message);
      res.redirect(`/admin/species/edit/${id}?errorMessage=${errorMessage}`);
    }
  },
  async getAllSpecies(req, res) {
    const { errorMessage, successMessage } = req.query;
    const species = await getAllSpecies();
    res.render("manageSpecies", { species, title: "Gestion des espèces - Greenroots", errorMessage, successMessage });
  },

  async showCreateSpecie(req, res) {
    const { errorMessage } = req.query;
    res.render("createSpecie", { title: "Créer une espèce - Greenroots", errorMessage });
  },
  async showEditSpecie(req, res) {
    const { id } = req.params;
    const { errorMessage, successMessage } = req.query;

    const specie = await getSpecieById(id);
    if (!specie) {
      const errorMessage = encodeURIComponent("Espèce non trouvée");
      return res.redirect(`/admin/species?errorMessage=${errorMessage}`);
    }
    res.render("editSpecie", { title: `Modifier l'espèce ${specie.name} - Greenroots`, errorMessage, successMessage, specie });
  },
};