import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class User extends Model {}

User.init({
  firstname: {
    type: DataTypes.STRING, 
    allowNull: true 
  },
  lastname: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  mail: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  address_number: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  address_streetname: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  postal_code: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  city: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  phone_number: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "role",
      key: "id"
    }
  }
}, {
  sequelize,
  tableName: "user",
});
