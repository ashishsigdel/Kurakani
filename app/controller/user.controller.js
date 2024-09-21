import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import db from "../models/index.js";

const { User, Connection, ConnectionRequest, Conversation, Op, Sequelize } = db;

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: {
      excludes: ["password"],
    },
  });
  return new ApiResponse({
    status: 200,
    message: "All users fetched successfully",
    data: users,
  }).send(res);
});

export const getRandomUsers = asyncHandler(async (req, res) => {
  const { search } = req.query; // Get search query from request
  const userId = req.user.id;

  if (search) {
    // If search query is provided, search by username or fullName
    const users = await User.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                username: {
                  [Op.like]: `%${search}%`, // Search by username
                },
              },
              {
                fullName: {
                  [Op.like]: `%${search}%`, // Search by full name
                },
              },
            ],
          },
          {
            id: {
              [Op.not]: userId, // Exclude the current user
            },
          },
        ],
      },
    });

    return new ApiResponse({
      status: 200,
      message: "Users fetched successfully",
      data: users,
    }).send(res);
  } else {
    // If no search query, fetch random users
    const friends = await Connection.findAll({
      where: {
        userId: userId,
      },
      attributes: ["friendId"],
    });

    const friendIds = friends.map((friend) => friend.friendId);

    const randomUsers = await User.findAll({
      where: {
        id: {
          [Op.notIn]: [...friendIds, userId],
        },
      },
      order: Sequelize.literal("RAND()"), // Randomize selection
      limit: 10, // Limit to 10 users
    });

    return new ApiResponse({
      status: 200,
      message: "Random users fetched successfully",
      data: randomUsers,
    }).send(res);
  }
});
