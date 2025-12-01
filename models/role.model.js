import { DataTypes, Model} from "sequelize";
import { sequelize } from "../config/db.js";

export class Role extends Model {}

Role.init({
  name: { 
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  tableName: "role",
});

