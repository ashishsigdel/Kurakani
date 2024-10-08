import { comparePassword, hashPassword } from "../services/passwordServices.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import db from "../models/index.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../../app.js";

const { User, Message, Conversation, Connection } = db;

export const sendMessage = asyncHandler(async (req, res) => {
  const { message, receiverId, conversationId } = req.body;

  const user = req.user;

  if (!message) {
    throw new ApiError({
      status: 400,
      message: "Nothing to send.",
    });
  }

  if (!receiverId) {
    throw new ApiError({
      status: 400,
      message: "Receiver missing.",
    });
  }

  if (!conversationId) {
    throw new ApiError({
      status: 400,
      message: "Cannot find room.",
    });
  }

  const receiver = await User.findByPk(receiverId);

  if (!receiver) {
    throw new ApiError({
      status: 400,
      message: "Receiver missing.",
    });
  }

  const chatRoom = await Conversation.findByPk(conversationId);

  if (!chatRoom) {
    throw new ApiError({
      status: 400,
      message: "Cannot find room.",
    });
  }

  const verifyChatRoom = await Connection.findOne({
    where: {
      userId: user.id,
      friendId: receiver.id,
      conversationId: chatRoom.id,
    },
  });

  if (!verifyChatRoom) {
    throw new ApiError({
      status: 400,
      message: "You should connect to send message.",
    });
  }

  const newMessage = await Message.create({
    senderId: user.id,
    receiverId: receiver.id,
    conversationId: chatRoom.id,
    message,
  });

  await Connection.update(
    {
      lastMessageAt: Date.now(),
    },
    {
      where: {
        conversationId: chatRoom.id,
      },
    }
  );

  const receiverSocketId = getReceiverSocketId(receiver.id);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  return new ApiResponse({
    status: 200,
    message: "Message sent successfully.",
    data: newMessage,
  }).send(res);
});

export const fetchAllMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.query;

  const user = req.user;

  if (!conversationId) {
    throw new ApiError({
      status: 400,
      message: "Cannot find room.",
    });
  }

  const chatRoom = await Conversation.findByPk(conversationId);

  if (!chatRoom) {
    throw new ApiError({
      status: 400,
      message: "Cannot find room.",
    });
  }

  const connection = await Connection.findOne({
    where: {
      userId: user.id,
      conversationId: chatRoom.id,
    },
  });

  if (!connection) {
    throw new ApiError({
      status: 400,
      message: "You can't view message.",
    });
  }

  const allMessages = await Message.findAll({
    where: {
      conversationId,
    },
  });

  // Add isSendByMe property
  const messagesWithStatus = allMessages.map((message) => ({
    ...message.toJSON(), // Convert Sequelize instance to plain object
    isSendByMe: message.senderId === user.id, // Check if the sender is the current user
  }));

  return new ApiResponse({
    status: 200,
    message: "All messages fetched successfully.",
    data: messagesWithStatus,
  }).send(res);
});

export const getUserByConversationId = asyncHandler(async (req, res) => {
  const { conversationId } = req.query;

  const user = req.user;

  if (!conversationId) {
    throw new ApiError({
      status: 400,
      message: "Cannot find room.",
    });
  }

  const chatRoom = await Conversation.findByPk(conversationId);

  if (!chatRoom) {
    throw new ApiError({
      status: 400,
      message: "Cannot find room.",
    });
  }

  const connection = await Connection.findOne({
    where: {
      userId: user.id,
      conversationId: chatRoom.id,
    },
    attributes: ["id", "conversationId", "friendId"],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "fullName", "username", "email", "profilePic"],
        required: false,
      },
    ],
  });

  if (!connection) {
    throw new ApiError({
      status: 400,
      message: "You can't view message.",
    });
  }

  return new ApiResponse({
    status: 200,
    message: "Friend info fetched successfully.",
    data: connection,
  }).send(res);
});
