import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import db from "../models/index.js";

const { User, Connection, ConnectionRequest, Conversation, Op } = db;

export const connectRequest = asyncHandler(async (req, res) => {
  const { message, receiverId } = req.body;

  if (!receiverId) {
    throw new ApiError({
      message: "Cannot prcess request!",
      status: 400,
    });
  }

  const user = req.user;

  if (user.id === receiverId) {
    throw new ApiError({
      message: "Cannot send request to yourself!",
      status: 400,
    });
  }

  const receiver = await User.findByPk(receiverId);

  if (!receiver) {
    throw new ApiError({
      message: "User not found!",
      status: 404,
    });
  }

  let requestMessage = message || `${user.fullName} wants to connect.`;

  const alreadyConnected = await Connection.findOne({
    where: {
      userId: user.id,
      friendId: receiverId,
    },
  });

  if (alreadyConnected) {
    throw new ApiError({
      message: "Already connected!",
      status: 400,
    });
  }

  const alreadyRequst = await ConnectionRequest.findOne({
    where: {
      senderId: user.id,
      receiverId,
    },
  });

  if (alreadyRequst) {
    await ConnectionRequest.destroy({
      where: {
        senderId: user.id,
        receiverId,
      },
    });

    return new ApiResponse({
      status: 200,
      message: "Request removed",
    }).send(res);
  }

  const createRequest = await ConnectionRequest.create({
    senderId: user.id,
    receiverId: receiver.id,
    message: requestMessage,
    status: "pending",
  });

  return new ApiResponse({
    status: 200,
    message: "Request sent.",
    data: createRequest,
  }).send(res);
});

export const acceptRequest = asyncHandler(async (req, res) => {
  const { connectionRequestId } = req.query;

  const connection = await ConnectionRequest.findByPk(connectionRequestId);

  if (!connection) {
    throw new ApiError({
      status: 404,
      message: "Connection not found!",
    });
  }

  const receiverId = connection.receiverId;

  const user = req.user;

  if (receiverId !== user.id) {
    throw new ApiError({
      status: 0,
      message: "You are not authorize to accept.",
    });
  }

  const ConversationRoom = await Conversation.create();

  //connection from your side
  const newConnection = await Connection.create({
    userId: user.id,
    friendId: connection.senderId,
    conversationId: ConversationRoom.id,
    lastMessageAt: Date.now(),
  });

  //conncetion from friends side
  await Connection.create({
    userId: connection.senderId,
    friendId: user.id,
    conversationId: ConversationRoom.id,
    lastMessageAt: Date.now(),
  });

  await connection.destroy();

  return new ApiResponse({
    status: 200,
    message: "Request accepted.",
    data: newConnection,
  }).send(res);
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const { connectionRequestId } = req.query;

  const connection = await ConnectionRequest.findByPk(connectionRequestId);

  if (!connection) {
    throw new ApiError({
      status: 404,
      message: "Connection not found!",
    });
  }

  const receiverId = connection.receiverId;

  const user = req.user;

  if (receiverId !== user.id) {
    throw new ApiError({
      status: 400,
      message: "You are not authorize to reject.",
    });
  }

  await connection.destroy();

  return new ApiResponse({
    status: 200,
    message: "Request rejected.",
  }).send(res);
});

export const getRequestList = asyncHandler(async (req, res) => {
  const user = req.user;

  const allRequests = await ConnectionRequest.findAll({
    where: {
      receiverId: user.id,
    },
    attributes: ["id", "message", "createdAt"],
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "fullName", "username", "email", "profilePic"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return new ApiResponse({
    status: 200,
    message: "All request fetched successfully.",
    data: allRequests,
  }).send(res);
});

export const getAllConnection = asyncHandler(async (req, res) => {
  const user = req.user;
  const { search } = req.query; // Get search query from request

  const whereConditions = {
    userId: user.id,
  };

  const includeConditions = {
    model: User,
    as: "user",
    attributes: ["id", "fullName", "username", "email", "profilePic"],
  };

  if (search) {
    // Add search conditions to filter by `fullName` or `username`
    includeConditions.where = {
      [Op.or]: [
        {
          fullName: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          username: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    };
  }

  const allConnections = await Connection.findAll({
    where: whereConditions,
    attributes: ["id", "conversationId", "lastMessageAt", "friendId"],
    include: [includeConditions],
    order: [["lastMessageAt", "DESC"]],
  });

  return new ApiResponse({
    status: 200,
    message: "Connection list fetched successfully.",
    data: allConnections,
  }).send(res);
});
