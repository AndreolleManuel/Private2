import path from "path";
import fs from "fs/promises"; 
import { Op } from "sequelize";
import {
  getAllCountries,
  getAllTrees,
  getAllCampaigns,
  getCampaignById,
  createCampaign,
} from "../../services/index.js";
import { Tree } from "../../models/index.js";

const isHttpUrl = (s) => typeof s === "string" && /^https?:\/\//i.test(s);
const toRelUploadPath = (filename) => `/img/uploads/${filename}`;
function todayISO() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SORT_MAP = {
  name_asc:       [["name", "ASC"]],
  name_desc:      [["name", "DESC"]],
  begin_date_asc: [["begin_date", "ASC"]],
  begin_date_desc:[["begin_date", "DESC"]],
  end_date_asc:   [["end_date", "ASC"]],
  end_date_desc:  [["end_date", "DESC"]],
};

export const campaignController = {
  async createCampaign(req, res) {
    const { name, description, begin_date, end_date, country_id, image_url } = req.body;
    if (
      !name ||
      !begin_date ||
      !end_date ||
      !country_id
    ) {
      const errorMessage = encodeURIComponent(
        "Tous les champs obligatoires doivent être remplis"
      );
      return res.redirect(
        `/admin/campaigns/create?errorMessage=${errorMessage}`
      );
    }
    const imagePath = req.file
      ? toRelUploadPath(req.file.filename)
      : (image_url?.trim() || null);
    
    const newCampaignData = {
      name,
      description,
      begin_date,
      end_date,
      country_id,
      image: imagePath,
    };
    try {
      await createCampaign(newCampaignData);
      const successMessage = encodeURIComponent("Campagne créée avec succès");
      res.redirect(`/admin/campaigns?successMessage=${successMessage}`);
    } catch (error) {
      const errorMessage = encodeURIComponent(
        "Erreur lors de la création de la campagne: " + error.message
      );
      res.redirect(`/admin/campaigns/create?errorMessage=${errorMessage}`);
    }
  },

  async editCampaign(req, res) {
    const { id } = req.params;
    const { name, description, begin_date, end_date, country_id, image_url } = req.body;
    let tree = req.body.tree;
    if (typeof tree === "string") {
      tree = [tree];
    }
    if (!Array.isArray(tree)) {
      tree = [];
    }
    const treeIds = tree.map((v) => Number(v)).filter(Number.isFinite);

    const campaign = await getCampaignById(id);
    if (!campaign) {
      const errorMessage = encodeURIComponent("Campagne non trouvée");
      return res.redirect(
        `/admin/campaigns/edit/${id}?errorMessage=${errorMessage}`
      );
    }
    // Handle image update
    const uploadedRel = req.file ? toRelUploadPath(req.file.filename) : null;
    const providedUrl = image_url?.trim() ? image_url.trim() : null;
    let newImage = undefined; // undefined => no edit; null => erase; string => replace
    if (uploadedRel) newImage = uploadedRel;
    else if (providedUrl) newImage = providedUrl;

    const updatedData = {
      name,
      description,
      begin_date,
      end_date,
      country_id,
      tree : treeIds,
    };
    if (newImage !== undefined) updatedData.image = newImage;
    const wasLocal = campaign.image && !isHttpUrl(campaign.image);
    const willReplaceImage = newImage !== undefined;
    if (wasLocal && willReplaceImage) {
      const abs = path.join("public", campaign.image.replace(/^\/+/, ""));
      try { await fs.unlink(abs); } catch (e) {
        console.warn("Suppression image locale échouée:", e.message);
      }
    }
   
    try {
      await campaign.update(updatedData);
      const successMessage = encodeURIComponent(
        "Campagne mis à jour avec succès"
      );
      res.redirect(`/admin/campaigns?successMessage=${successMessage}`);
    } catch (error) {
      const errorMessage = encodeURIComponent(
        "Erreur lors de la mise à jour de la Campagne: " + error.message
      );
      res.redirect(`/admin/campaigns/edit/${id}?errorMessage=${errorMessage}`);
    }
  },

  // delete a campaign if admin
  async deleteCampaign(req, res) {
    const { id } = req.params;
    const campaign = await getCampaignById(id);
    if (!campaign) {
      const errorMessage = encodeURIComponent("Campagne non trouvée");
      return res.redirect(`/admin/campaigns?errorMessage=${errorMessage}`);
    }
    const count = await Tree.count({ where: { campaign_id: id } });
    if (count > 0) {
      const errorMessage = encodeURIComponent(
        "Impossible de supprimer une campagne associée à des arbres"
      );
      return res.redirect(`/admin/campaigns?errorMessage=${errorMessage}`);
    }
    // Delete local image if exists
    if (campaign.image && !isHttpUrl(campaign.image)) {
      const abs = path.join("public", campaign.image.replace(/^\/+/, ""));
      try { await fs.unlink(abs); } catch (e) { /* ignore */ }
    }

    try {
      await campaign.destroy();
      const successMessage = encodeURIComponent(
        "Campagne supprimée avec succès"
      );
      res.redirect(`/admin/campaigns?successMessage=${successMessage}`);
    } catch (error) {
      const errorMessage = encodeURIComponent(
        "Erreur lors de la suppression de l'arbre: " + error.message
      );
      res.redirect(`/admin/campaigns?errorMessage=${errorMessage}`);
    }
  },
  async getAllCampaigns(req, res) {
    const { q, status, country_id, from, to, sort } = req.query;
    const where = {};

    // FILTER and SEARCH
    // text search
    if (q && q.trim() !== "") {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${q.trim().toLowerCase()}%` } },
        { description: { [Op.iLike]: `%${q.trim().toLowerCase()}%` } },
      ];
    }

    // country filter
    if (country_id && !isNaN(country_id)) {
      where.country_id = Number(country_id);
    }

    // Period filter
    if (from) where.begin_date = { ...(where.begin_date || {}), [Op.gte]: from };
    if (to)   where.end_date   = { ...(where.end_date   || {}), [Op.lte]: to   };

    // Status (on DATEONLY)
    if (status === "active" || status === "upcoming" || status === "ended") {
      const today = todayISO();
      if (status === "active") {
        where.begin_date = { ...(where.begin_date || {}), [Op.lte]: today };
        where.end_date   = { ...(where.end_date   || {}), [Op.gte]: today };
      } else if (status === "upcoming") {
        where.begin_date = { ...(where.begin_date || {}), [Op.gt]: today };
      } else if (status === "ended") {
        where.end_date   = { ...(where.end_date   || {}), [Op.lt]: today };
      }
    }

    // Sorting
    const order = SORT_MAP[sort] || SORT_MAP.name_asc;

    const campaigns = await getAllCampaigns(where, order);
    const countries = await getAllCountries();
    res.render("manageCampaigns", {
      campaigns,
      countries,
      title: "Gestion des campagnes - Greenroots",
      errorMessage: req.query.errorMessage,
      successMessage: req.query.successMessage,
    });
  },

  async showCreateCampaign(req, res) {
    const countries = await getAllCountries();
    const errorMessage = req.query.errorMessage;
    res.render("createCampaign", {
      countries,
      title: "Ajouter une campagne - Greenroots",
      errorMessage,
    });
  },

  async showEditCampaign(req, res) {
    const { id } = req.params;
    const { errorMessage } = req.query;
    console.log(req.body);

    const campaign = await getCampaignById(id);
    if (!campaign) {
      const errorMessage = encodeURIComponent("Campagne non trouvée");
      return res.redirect(
        `/admin/campaigns/edit/${id}?errorMessage=${errorMessage}`
      );
    }
    const countries = await getAllCountries();
    const trees = await getAllTrees();
    campaign.country = countries;
    campaign.tree = trees;
    res.render("editCampaign", {
      campaign,
      countries,
      trees,
      title: `Modifier la campagne ${campaign.name} - Greenroots`,
      errorMessage,
    });
  },
};
