import { adminController, campaignController, treeController, countryController, specieController, orderController, userController } from "../controllers/admin/index.js";
import { checkId, requireAdmin, validate } from "../middlewares/index.js";
import { loginUserSchema, updateTreeSchema, createTreeSchema, Country, createSpecieSchema, updateSpecieSchema, createCampaignSchema, updateCampaignSchema, createUserSchemaBO, updateUserSchemaBO } from "../schemas/index.js";
import { upload } from "../middlewares/upload.middleware.js";
import { Router } from "express";

export const adminRouter = Router();

// Admin dashboard
adminRouter.get("/", adminController.index);

// Admin authentication routes
adminRouter.get("/", adminController.index);
adminRouter.get("/login", adminController.showLogin);
adminRouter.post("/login", validate(loginUserSchema), adminController.handleLogin);
adminRouter.get("/logout", requireAdmin, adminController.handleLogout);

// CRUD campaigns
adminRouter.get("/campaigns", requireAdmin, campaignController.getAllCampaigns);
adminRouter.get("/campaigns/create", requireAdmin, campaignController.showCreateCampaign);
adminRouter.post("/campaigns/create", requireAdmin, upload.single("image"), validate(createCampaignSchema), campaignController.createCampaign);
adminRouter.get("/campaigns", requireAdmin, campaignController.getAllCampaigns);
adminRouter.get("/campaigns/edit/:id", requireAdmin, checkId, campaignController.showEditCampaign);
adminRouter.post("/campaigns/edit/:id", requireAdmin, checkId, upload.single("image"), validate(updateCampaignSchema), campaignController.editCampaign);
adminRouter.post("/campaigns/delete/:id", requireAdmin, checkId, campaignController.deleteCampaign);


// CRUD trees
adminRouter.get("/trees", requireAdmin, treeController.getAllTrees);
adminRouter.get("/trees/create", requireAdmin, treeController.showCreateTree);
adminRouter.post("/trees/create", requireAdmin, upload.single("image"), validate(createTreeSchema), treeController.createTree);
adminRouter.get("/trees/edit/:id", requireAdmin, checkId, treeController.showEditTree);
adminRouter.post("/trees/edit/:id", requireAdmin, checkId, upload.single("image"), validate(updateTreeSchema), treeController.editTree);
adminRouter.post("/trees/delete/:id", requireAdmin, checkId, treeController.deleteTree);

// CRUD countries
adminRouter.get("/countries", requireAdmin, countryController.getAllCountries);
adminRouter.get("/countries/create", requireAdmin, countryController.showCreateCountry);
adminRouter.post("/countries/create", requireAdmin, validate(Country), countryController.createCountry);

// CRUD species
adminRouter.get("/species", requireAdmin, specieController.getAllSpecies);
adminRouter.get("/species/create", requireAdmin, specieController.showCreateSpecie);
adminRouter.post("/species/create", requireAdmin, validate(createSpecieSchema), specieController.createSpecie);
adminRouter.get("/species/edit/:id", requireAdmin, checkId, specieController.showEditSpecie);
adminRouter.post("/species/edit/:id", requireAdmin, checkId, validate(updateSpecieSchema), specieController.editSpecie);

// Read Orders
adminRouter.get("/orders", requireAdmin, orderController.getAllOrders);
adminRouter.get("/orders/:id", requireAdmin, checkId, orderController.getOrderDetails);

// CRUD users
adminRouter.get("/users", requireAdmin, userController.getAllUsers);
adminRouter.post("/users", requireAdmin, validate(createUserSchemaBO), userController.createUser);
adminRouter.post("/users/edit/:id", requireAdmin, checkId, validate(updateUserSchemaBO), userController.updateUser);
adminRouter.post("/users/delete/:id", requireAdmin, checkId, userController.deleteUser);
