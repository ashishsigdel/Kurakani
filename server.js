import httpServer from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`🚀🔥 Server is running on port http://localhost:${PORT} 🔥🚀`);
});
