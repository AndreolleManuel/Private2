import path from "path";
import fs from "fs/promises";
import { Op } from "sequelize";
import {
  getAllTrees,
  getTreeById,
  getAllSpecies,
  getAllCampaigns,
  createTree,
} from "../../services/index.js";


const isHttpUrl = (s) => typeof s === "string" && /^https?:\/\//i.test(s);
const toRelUploadPath = (filename) => `/img/uploads/${filename}`;

function parseEuroToCents(input) {
  if (input == null) return null;
  const str = String(input).trim().replace(/\s/g, "").replace(",", ".");
  const euros = Number(str);
  if (!Number.isFinite(euros)) return null;
  return Math.round(euros * 100);
};

const isFilledNumber = (v) =>
  v !== undefined &&
  v !== null &&
  String(v).trim() !== "" &&
  Number.isFinite(Number(v));

function pickDefined(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

const SORT_MAP = {
  name_asc:      [["name", "ASC"]],
  name_desc:     [["name", "DESC"]],
  price_asc:     [["price", "ASC"]],   
  price_desc:    [["price", "DESC"]],
  quantity_asc:  [["quantity", "ASC"]],
  quantity_desc: [["quantity", "DESC"]],
  stock_asc:     [["stock", "ASC"]],
  stock_desc:    [["stock", "DESC"]],
};

export const treeController = {
  async createTree(req, res) {
    const {
      name,
      latin_name,
      price,        
      quantity,
      stock,
      specie_id,
      campaign_id,
      image_url,
    } = req.body;

    if (!name || price == null || quantity == null || stock == null || !specie_id || !campaign_id) {
      const errorMessage = encodeURIComponent("Tous les champs obligatoires doivent être remplis");
      return res.redirect(`/admin/trees/create?errorMessage=${errorMessage}`);
    }

    const price_cents = parseEuroToCents(price);
    if (price_cents == null || price_cents < 0) {
      const errorMessage = encodeURIComponent("Prix invalide");
      return res.redirect(`/admin/trees/create?errorMessage=${errorMessage}`);
    }

    const imagePath = req.file
      ? toRelUploadPath(req.file.filename)              
      : (image_url?.trim() || null);                         

    const newTreeData = {
      name,
      latin_name,
      price: price_cents,                                    
      quantity: Number(quantity),
      stock: Number(stock),
      specie_id: Number(specie_id),
      campaign_id: Number(campaign_id),                       
      image: imagePath,
    };

    try {
      await createTree(newTreeData);
      const successMessage = encodeURIComponent("Arbre créé avec succès");
      return res.redirect(`/admin/trees?successMessage=${successMessage}`);
    } catch (error) {
      const errorMessage = encodeURIComponent("Erreur lors de la création de l'arbre: " + error.message);
      return res.redirect(`/admin/trees/create?errorMessage=${errorMessage}`);
    }
  },

  async editTree(req, res) {
    const { id } = req.params;
    let {
      name,
      latin_name,
      price,       
      quantity,
      stock,
      specie_id,
      campaign_id,
      image_url,
    } = req.body;

    const tree = await getTreeById(id);
    if (!tree) {
      const errorMessage = encodeURIComponent("Arbre non trouvé");
      return res.redirect(`/admin/trees/edit/${id}?errorMessage=${errorMessage}`);
    }

    const uploadedRel = req.file ? toRelUploadPath(req.file.filename) : null;
    const providedUrl = image_url?.trim() ? image_url.trim() : null;

    let newImage = undefined;               
    if (uploadedRel) newImage = uploadedRel;
    else if (providedUrl) newImage = providedUrl;

    const updatedData = pickDefined({
      name,
      latin_name,
      price: price != null ? parseEuroToCents(price) : undefined,
      quantity: quantity != null ? Number(quantity) : undefined,
      stock: stock != null ? Number(stock) : undefined,
      specie_id: specie_id != null ? Number(specie_id) : undefined,    
      campaign_id: campaign_id != null ? Number(campaign_id) : undefined, 
      image: newImage !== undefined ? newImage : undefined,
    });

    const wasLocal = tree.image && !isHttpUrl(tree.image);
    const willReplaceImage = newImage !== undefined;
    if (wasLocal && willReplaceImage) {
      const abs = path.join("public", tree.image.replace(/^\/+/, ""));
      try { await fs.unlink(abs); } catch { /* ignore */ }
    }

    try {
      await tree.update(updatedData);
      const successMessage = encodeURIComponent("Arbre mis à jour avec succès");
      return res.redirect(`/admin/trees?successMessage=${successMessage}`);
    } catch (error) {
      const errorMessage = encodeURIComponent("Erreur lors de la mise à jour de l'arbre: " + error.message);
      return res.redirect(`/admin/trees/edit/${id}?errorMessage=${errorMessage}`);
    }
  },

  async deleteTree(req, res) {
    const { id } = req.params;
    const tree = await getTreeById(id);
    if (!tree) {
      const errorMessage = encodeURIComponent("Arbre non trouvé");
      return res.redirect(`/admin/trees?errorMessage=${errorMessage}`);
    }

    if (tree.image && !isHttpUrl(tree.image)) {
      const abs = path.join("public", tree.image.replace(/^\/+/, ""));
      try { await fs.unlink(abs); } catch { /* ignore */ }
    }

    try {
      await tree.destroy();
      const successMessage = encodeURIComponent("Arbre supprimé avec succès");
      return res.redirect(`/admin/trees?successMessage=${successMessage}`);
    } catch (error) {
      const errorMessage = encodeURIComponent("Erreur lors de la suppression de l'arbre: " + error.message);
      return res.redirect(`/admin/trees?errorMessage=${errorMessage}`);
    }
  },

  async getAllTrees(req, res) {
    const { errorMessage, successMessage } = req.query;
    const {
      q,
      specie_id,
      campaign_id,
      sort,
    } = req.query;

    const where = {};

    if (q && q.trim() !== "") {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${q.trim().toLowerCase()}%` } },
        { latin_name: { [Op.iLike]: `%${q.trim().toLowerCase()}%` } },
      ];
    }

    if (isFilledNumber(specie_id))   where.specie_id   = Number(specie_id);
    if (isFilledNumber(campaign_id)) where.campaign_id = Number(campaign_id);

    const order = SORT_MAP[sort] || SORT_MAP.name_asc;
    const trees = await getAllTrees(where, order);
    const campaigns = await getAllCampaigns();
    const species = await getAllSpecies();
    return res.render("manageTrees", {
      trees,
      campaigns,
      species,
      title: "Gestion des arbres - Greenroots",
      errorMessage,
      successMessage,
    });
  },

  async showCreateTree(req, res) {
    const species = await getAllSpecies();
    const campaigns = await getAllCampaigns();
    const errorMessage = req.query.errorMessage;
    return res.render("createTree", {
      species,
      campaigns,
      title: "Ajouter un arbre",
      errorMessage,
    });
  },

  async showEditTree(req, res) {
    const { id } = req.params;
    const { errorMessage } = req.query;

    const tree = await getTreeById(id);
    if (!tree) {
      const msg = encodeURIComponent("Arbre non trouvé");
      return res.redirect(`/admin/trees/edit/${id}?errorMessage=${msg}`);
    }

    const species = await getAllSpecies();
    const campaigns = await getAllCampaigns();

    return res.render("editTree", {
      tree,
      species,
      campaigns,
      title: `Modifier l'arbre ${tree.name}`,
      errorMessage,
    });
  },
};
