import express from "express";

import * as messageController from "../controller/message.controller.js";

import validate from "../validators/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/send")
  .post(authMiddleware, validate, messageController.sendMessage);

router
  .route("/")
  .get(authMiddleware, validate, messageController.fetchAllMessages);

export default router;
