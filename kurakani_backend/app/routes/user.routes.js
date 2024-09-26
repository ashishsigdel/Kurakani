import express from "express";

import * as userController from "../controller/user.controller.js";

import validate from "../validators/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/get-all")
  .get(authMiddleware, validate, userController.getAllUsers);

router
  .route("/get-random")
  .get(authMiddleware, validate, userController.getRandomUsers);

export default router;
