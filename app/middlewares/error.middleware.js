import ApiError from "../utils/apiError.js";
// import { removeUnusedMulterImageFilesOnError } from "../utils/helper.js";
import EnvType from "../enums/envType.js";
import multer from "multer";

const errorHandlerMiddleware = async (err, req, res, next) => {
  let error = err;

  // check if error is an instance of ApiError
  if (!(error instanceof ApiError)) {
    if (err instanceof multer.MulterError) {
      error = new ApiError({
        status: 400,
        message: err.message,
        errors: [
          {
            file: err.message,
          },
        ],
        stack: err.stack,
      });
    } else if (
      err.name === "SequelizeValidationError" ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      const errors = err.errors.map((error) => ({
        [error.path]: error.message,
      }));

      error = new ApiError({
        status: 400,
        message: errors[0][Object.keys(errors[0])[0]],
        errors,
        stack: err.stack,
      });
    } else {
      error = new ApiError({
        status: 500,
        message: "Something went wrong",
        errors: error.errors,
        stack: err,
      });
    }
  }

  // send error response by modifying the response object, show error stack in development
  const response = {
    ...error,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === EnvType.DEV && { stack: err.stack }),
  };

  //   removeUnusedMulterImageFilesOnError(req);

  if (process.env.NODE_ENV === EnvType.DEV) {
    console.log(err);
  }

  return res.status(error.status).json(response);
};

export default errorHandlerMiddleware;
