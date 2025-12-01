import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class OrderLine extends Model {}

OrderLine.init({
  tree_name: { 
    type: DataTypes.STRING,
    allowNull: false 
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: { min: 1 } 
  },
  unit_price: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: { min: 0 } 
  },
  total_price: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: { min: 0 } 
  },
}, {
  sequelize,
  tableName: "order_line",
});
