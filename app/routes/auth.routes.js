import express from "express";

import * as authController from "../controller/auth.controller.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/user.validators.js";
import validate from "../validators/validate.js";

const router = express.Router();

router
  .route("/register")
  .post(registerValidator(), validate, authController.register);

router.post("/login", loginValidator(), validate, authController.login);

router.post("/logout", authController.logout);

export default router;
