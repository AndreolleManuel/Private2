import { Campaign } from "./campaign.model.js";
import { Country } from "./country.model.js";
import { Role } from "./role.model.js";
import { Specie } from "./specie.model.js";
import { Tree } from "./tree.model.js";
import { User } from "./user.model.js";
import { Order } from "./order.model.js";
import { OrderLine } from "./order-line.model.js";
import { PaymentIntentDraft } from "./payment-intent-draft.model.js";
import { sequelize } from "../config/db.js";

// Define associations here

// User - Role (Many-to-One)
User.belongsTo(Role, { 
  foreignKey: { name: "role_id", allowNull: false },
  as: "role",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT"
});
Role.hasMany(User, { 
  foreignKey: { name: "role_id" }, 
  as: "users"
});

//User - Order (One-to-Many)
User.hasMany(Order,{
  foreignKey: { name: "user_id", allowNull: false },
  as: "orders"
});
Order.belongsTo(User,{
  foreignKey: { name: "user_id", allowNull: false },
  as: "user",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT"
});

//Order - OrderLine (One-to-Many)
Order.hasMany(OrderLine,{
  foreignKey: { name: "order_id", allowNull: false },
  as: "order_lines"
});
OrderLine.belongsTo(Order,{
  foreignKey: { name: "order_id", allowNull: false },
  as: "order",
  onUpdate: "CASCADE",
  onDelete: "CASCADE"
});

// OrderLine - Tree (Many-to-One)
OrderLine.belongsTo(Tree,{
  foreignKey: { name: "tree_id", allowNull: true },
  as: "tree",
  onUpdate: "CASCADE",
  onDelete: "SET NULL"
});
Tree.hasMany(OrderLine,{
  foreignKey: { name: "tree_id" },
  as: "order_lines"
});

// Tree - Specie (Many-to-One)
Tree.belongsTo(Specie,{
  foreignKey: { name: "specie_id", allowNull: false },
  as: "specie",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT"
});
Specie.hasMany(Tree,{
  foreignKey: { name: "specie_id" },
  as: "trees"
});

// Tree - Campaign (Many-to-One)
Tree.belongsTo(Campaign,{
  foreignKey: { name: "campaign_id", allowNull: true },
  as: "campaign",
  onUpdate: "CASCADE",
});
Campaign.hasMany(Tree,{
  foreignKey: { name: "campaign_id" },
  as: "trees"
});

// Campaign - Country (Many-to-One)
Campaign.belongsTo(Country,{
  foreignKey: { name: "country_id", allowNull: false },
  as: "country",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT"
});
Country.hasMany(Campaign,{
  foreignKey: { name: "country_id" },
  as: "campaigns"
});

// User - Tree (Many-to-Many) - for wishlist
User.belongsToMany(Tree, {
  through: "user_wishlist",
  as: "wishlist",
  foreignKey: "user_id",
  otherKey: "tree_id"
});
Tree.belongsToMany(User, {
  through: "user_wishlist",
  as: "wishers",
  foreignKey: "tree_id",
  otherKey: "user_id"
});

// Draft -> User (One-to-Many)
PaymentIntentDraft.belongsTo(User, {
  foreignKey: { name: "user_id", allowNull: true },
  as: "user"
});
User.hasMany(PaymentIntentDraft, {
  foreignKey: { name: "user_id", allowNull: true },
  as: "paymentDrafts"
});

// Draft -> Order (nullable)
PaymentIntentDraft.belongsTo(Order, { foreignKey: { name: "order_id", allowNull: true }, as: "order" });
Order.hasOne(PaymentIntentDraft,    { foreignKey: { name: "order_id", allowNull: true }, as: "payment_intent_draft" });

export {
  Campaign,
  Country,
  Role,
  Specie,
  Tree,
  User,
  Order,
  OrderLine,
  PaymentIntentDraft,
  sequelize
};