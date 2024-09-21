import httpServer from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8080;

import { sequelize } from "./app/database/dbConfig.js";

httpServer.listen(PORT, () => {
  console.log(`🚀🔥 Server is running on port http://localhost:${PORT} 🔥🚀`);
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await sequelize.sync({ force: false, alter: false });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.log("An error occurred while starting the server:", error);
    process.exit(1);
  }
})();
