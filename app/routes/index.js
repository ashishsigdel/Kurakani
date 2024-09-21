import express from "express";

import authRoute from "./auth.routes.js";
import connectionRoute from "./connection.routes.js";
import userRoute from "./user.routes.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/connection", connectionRoute);
router.use("/users", userRoute);

export default router;
