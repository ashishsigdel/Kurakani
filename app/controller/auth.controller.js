import { comparePassword, hashPassword } from "../services/passwordServices.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import db from "../models/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
  getAuthToken,
  getCookieToken,
  verifyToken,
} from "../utils/jwtUtils.js";
import { getDateAfterMinutes } from "../utils/helper.js";

const { User, RefreshToken } = db;

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

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError({
      message: "Invalid credentials",
      status: 401,
    });
  }

  const isPasswordMatched = await comparePassword(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError({
      message: "Invalid credentials",
      status: 401,
    });
  }

  // generate refresh token
  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  // save refresh token
  const savedRefreshToken = await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: getDateAfterMinutes(
      parseInt(process.env.JWT_REFRESH_EXPIRES_IN)
    ), // converts minutes to milliseconds and add to current date
  });

  // generate access token
  const accessToken = generateAccessToken({
    userId: user.id,
    refreshTokenId: savedRefreshToken.id,
  });

  let responseData = {
    accessToken,
    user: await User.findOne({
      where: { id: user.id },
      attributes: ["id", "fullName", "username", "email", "profilePic"],
    }),
  };

  res.cookie("accessToken", `Bearer ${accessToken}`, {
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  return new ApiResponse({
    status: 200,
    message: "User logged in successfully",
    data: responseData,
  }).send(res);
});

export const logout = asyncHandler(async (req, res) => {
  const token = getCookieToken(req) || getAuthToken(req);

  if (!token) {
    throw new ApiError({
      message: "Unauthorized",
      status: 401,
    });
  }

  console.log(token);

  //verify token
  try {
    const decodedToken = verifyToken({
      token: token,
      ignoreExpiration: true,
    });

    //get refresh token from db
    const refreshToken = await RefreshToken.findOne({
      where: {
        id: decodedToken.rfId,
        userId: decodedToken.id,
      },
    });

    if (!refreshToken) {
      throw new ApiError({
        message: "Unauthorized",
        status: 401,
      });
    }

    // verify refresh token
    verifyToken({
      token: refreshToken.token,
    });

    //delete refresh token hard from db
    await RefreshToken.destroy({
      where: {
        id: refreshToken.id,
      },
      force: true,
    });

    //delete token from cookie
    res.clearCookie("accessToken");

    return new ApiResponse({
      status: 200,
      message: "Logged out successfully",
    }).send(res);
  } catch (error) {
    console.log(error);
    throw new ApiError({
      message: "Unauthorized",
      status: 401,
    });
  }
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = getCookieToken(req) || getAuthToken(req);

  if (!token) {
    throw new ApiError({
      message: "Unauthorized",
      status: 401,
    });
  }

  //verify token
  try {
    const decodedToken = verifyToken({
      token: token,
      ignoreExpiration: true,
    });

    //get refresh token from db
    const refreshToken = await RefreshToken.findOne({
      where: {
        id: decodedToken.rfId,
        userId: decodedToken.id,
      },
    });

    if (!refreshToken) {
      throw new ApiError({
        message: "Unauthorized",
        status: 401,
      });
    }

    // verify refresh token
    verifyToken({
      token: refreshToken.token,
    });

    //get user from db
    const user = await User.findOne({
      where: { id: decodedToken.id },
      attributes: ["id", "fullName", "username", "email", "profilePic"],
    });

    if (!user) {
      throw new ApiError({
        message: "Unauthorized",
        status: 401,
      });
    }

    //generate access token
    const accessToken = generateAccessToken({
      userId: user.id,
      roles: user.roles,
      refreshTokenId: refreshToken.id,
    });

    // replace old refresh token with new one in cookie
    res.cookie("accessToken", `Bearer ${accessToken}`, {
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });

    let responseData = {
      accessToken,
      user,
    };

    return new ApiResponse({
      status: 200,
      message: "Access token refreshed successfully",
      data: responseData,
    }).send(res);
  } catch (error) {
    logger.error(error);
    throw new ApiError({
      message: "Unauthorized",
      status: 401,
    });
  }
});
