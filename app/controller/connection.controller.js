import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import db from "../models/index.js";

const { User, Connection, ConnectionRequest, Conversation } = db;

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
      status: 401,
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
      status: 401,
      message: "You are not authorize to reject.",
    });
  }

  await connection.destroy();

  return new ApiResponse({
    status: 200,
    message: "Request rejected.",
  }).send(res);
});
