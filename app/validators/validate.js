import { validationResult } from "express-validator";
import errorHanlerMiddleware from "../middlewares/error.middleware.js";
import ApiError from "../utils/apiError.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];

  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  throw new ApiError({
    message: errors.array()[0].msg,
    errors: extractedErrors,
    status: 422,
  });
};

export default validate;
