import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class Order extends Model {}

Order.init({
  order_number: { 
    type: DataTypes.TEXT, 
    allowNull: false, 
    unique: true 
  },
  total_price: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: { min: 0 } 
  },
  payment_intent_id: { 
    type: DataTypes.TEXT, 
    allowNull: true,
    unique: true
  }
}, {
  sequelize,
  tableName: "order",
});