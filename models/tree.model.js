import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class Tree extends Model {}

Tree.init({
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  latin_name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  price: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 0, 
    validate: { min: 0 } 
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 0, 
    validate: { min: 0 } 
  },
  stock: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 0, 
    validate: { min: 0 }
  },
  image: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }
}, {
  sequelize,
  tableName: "tree"
});
