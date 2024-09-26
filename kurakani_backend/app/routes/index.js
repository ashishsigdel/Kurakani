import express from "express";

import authRoute from "./auth.routes.js";
import connectionRoute from "./connection.routes.js";
import userRoute from "./user.routes.js";
import messageRoute from "./message.routes.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/connection", connectionRoute);
router.use("/users", userRoute);
router.use("/messages", messageRoute);

export default router;
