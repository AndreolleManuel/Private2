import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_URL,
  {
    logging: false, // disable sequelize logs
    define: {
      createdAt: "created_at", // field name mapping, for retrieval
      updatedAt: "updated_at",
      underscored: true, // synchronize fields in snake_case
    }
  }
);

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}