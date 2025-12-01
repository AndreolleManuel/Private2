import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class Campaign extends Model {}

Campaign.init({
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  begin_date: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  end_date: { 
    type: DataTypes.DATEONLY, 
    allowNull: false,
    validate: {
      isAfterBeginDate(value) {
        const begin = this.getDataValue("begin_date");
        if (begin && new Date(value) < new Date(begin)) {
          throw new Error("End date must be after begin date");
        }
      }
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  sequelize,
  tableName: "campaign"
});
