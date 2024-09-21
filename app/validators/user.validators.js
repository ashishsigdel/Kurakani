import { body } from "express-validator";
import db from "../models/index.js";
import { validatePassword } from "../services/passwordServices.js";
const { User, Op } = db;

export const registerValidator = () => {
  //validate fullName, email, password and confirmPassword
  return [
    body("fullName")
      .exists() // check if fullName exists
      .withMessage("Full name is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if fullName is not empty
      .withMessage("Full name is required")
      .bail() // stop validation chain if any of the above fails
      .isLength({ min: 3 }) // check if fullName is atleast 3 characters long
      .withMessage("Full name should be atleast 3 characters long")
      .bail() // stop validation chain if any of the above fails
      .matches(/^[a-zA-Z ]*$/) // check if fullName contains only alphabets and spaces
      .withMessage("Full name should contain only alphabets and spaces")
      .bail(), // stop validation chain if any of the above fails
    body("email")
      .exists() // check if email exists
      .withMessage("Email is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if email is not empty
      .withMessage("Email is required")
      .bail() // stop validation chain if any of the above fails
      .isEmail() // check if email is valid
      .withMessage("Email is invalid")
      .bail() // stop validation chain if any of the above fails
      .custom(async (value) => {
        // check if email already exists
        const user = await User.findOne({ where: { email: value } });
        if (user) {
          throw new Error("Email already exists");
        }
        return true;
      }),
    body("password")
      .exists() // check if password exists
      .withMessage("Password is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if password is not empty
      .withMessage("Password is required")
      .bail() // stop validation chain if any of the above fails
      .isLength({ min: 8 }) // check if password is atleast 6 characters long
      .withMessage("Password should be atleast 8 characters long")
      .bail() // stop validation chain if any of the above fails
      .custom((value) => {
        // check if password is valid
        if (!validatePassword(value)) {
          throw new Error(
            "Password must be greater than 8 characters, contain both uppercase and lowercase letters, include digits, and should not have any spaces."
          );
        }
        return true;
      }),
    body("confirmPassword")
      .exists() // check if confirmPassword exists
      .withMessage("Confirm password is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if confirmPassword is not empty
      .withMessage("Confirm password is required")
      .bail() // stop validation chain if any of the above fails
      .custom((value, { req }) => {
        // check if confirmPassword matches password
        if (value !== req.body.password) {
          throw new Error("Confirm password does not match");
        }
        return true;
      }),
  ];
};
