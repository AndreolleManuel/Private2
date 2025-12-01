import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class Specie extends Model {}

Specie.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: "specie",
});


