import asyncHandler from "../utils/asyncHandler.js";
import {
  getAuthToken,
  getCookieToken,
  verifyToken,
} from "../utils/jwtUtils.js";
import db from "../models/index.js";
import ApiError from "../utils/apiError.js";

const { User, RefreshToken } = db;

export const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = getCookieToken(req) || getAuthToken(req);

    if (!accessToken) {
      throw new ApiError({
        status: 401,
        message: "Missing token",
        stack: "Access token not found",
      });
    }

    const decodedToken = verifyToken({
      token: accessToken,
    });

    const refreshToken = await RefreshToken.findOne({
      where: {
        id: decodedToken.rfId,
        userId: decodedToken.id,
      },
    });

    if (!refreshToken) {
      throw new ApiError({
        status: 401,
        message: "Invalid token",
        stack: "Refresh token not found",
      });
    }

    // verify refresh token
    verifyToken({
      token: refreshToken.token,
    });

    //check if refresh token is revoked
    if (refreshToken.revoked) {
      throw new ApiError({
        status: 401,
        message: "Invalid token",
        stack: "Refresh token revoked",
      });
    }

    // check if refresh token is expired
    if (refreshToken.expiresAt < Date.now()) {
      throw new ApiError({
        status: 401,
        message: "Invalid token",
        stack: "Refresh token expired",
      });
    }

    // check if user exists
    const user = await User.findOne({
      where: {
        id: decodedToken.id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
      throw new ApiError({
        status: 401,
        message: "Invalid token",
        stack: "User not found with provided token",
      });
    }

    // set user in request object
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError({
      status: 401,
      message: "Invalid token",
      stack: error.stack,
    });
  }
});
