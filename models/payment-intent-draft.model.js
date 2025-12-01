import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class PaymentIntentDraft extends Model {}

PaymentIntentDraft.init({
  payment_intent_id: { 
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  amount: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  items_json: { 
    type: DataTypes.JSONB,
    allowNull: false
  },
  status: { 
    type: DataTypes.ENUM("pending", "completed", "failed"),
    allowNull: false,
    defaultValue: "pending"
  },
}, {
  sequelize,
  tableName: "payment_intent_draft",
});