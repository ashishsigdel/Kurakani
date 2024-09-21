import { hashPassword } from "../services/passwordServices.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import db from "../models/index.js";

const { User } = db;

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  //encrypt password
  const hashedPassword = await hashPassword(password);

  //generate username from email
  let username = email.split("@")[0];

  username = username.split(".").join("");

  // validate username
  const isUsernameAlreadyExists = await User.findOne({
    where: { username: username },
  });

  if (isUsernameAlreadyExists) {
    // if username already exists, append id that come next to username
    const lastUser = await User.findOne({
      order: [["id", "DESC"]],
    });

    const lastUserId = lastUser.id;

    const newUsername = `${username}${lastUserId + 1}`;

    username = newUsername;
  }

  //create user
  const user = await User.create({
    fullName,
    username,
    email,
    password: hashedPassword,
  });

  //send response
  return new ApiResponse({
    status: 201,
    message: "User registered successfully",
  }).send(res);
});
