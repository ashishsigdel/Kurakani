import express from "express";

import * as connectionController from "../controller/connection.controller.js";

import validate from "../validators/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/add")
  .post(authMiddleware, validate, connectionController.connectRequest);

router
  .route("/accept")
  .post(authMiddleware, validate, connectionController.acceptRequest);

router
  .route("/reject")
  .post(authMiddleware, validate, connectionController.rejectRequest);

router
  .route("/get-all-request")
  .get(authMiddleware, validate, connectionController.getRequestList);

router
  .route("/get-all-connections")
  .get(authMiddleware, validate, connectionController.getAllConnection);

export default router;
