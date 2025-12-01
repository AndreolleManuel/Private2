import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class Country extends Model {}

Country.init({
  name: { 
    type: DataTypes.STRING,
    allowNull: false, 
    unique: true 
  }
}, {
  sequelize,
  tableName: "countries"
});
