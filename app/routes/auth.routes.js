import express from "express";

import * as authController from "../controller/auth.controller.js";
import { registerValidator } from "../validators/user.validators.js";
import validate from "../validators/validate.js";

const router = express.Router();

router
  .route("/register")
  .post(registerValidator(), validate, authController.register);

export default router;
