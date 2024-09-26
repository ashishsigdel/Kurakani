import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const setUpSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["POST", "GET", "DELETE", "PUT"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("isTyping", (data) => {
      const receiverSocketId = getReceiverSocketId(data.receiverId);
      io.to(receiverSocketId).emit("typing", {
        chatId: data.chatId,
        friendId: data.userId,
        typing: true,
      });
    });
    socket.on("notTyping", (data) => {
      const receiverSocketId = getReceiverSocketId(data.receiverId);
      io.to(receiverSocketId).emit("typing", {
        chatId: data.chatId,
        friendId: data.userId,
        typing: false,
      });
    });
  });

  return { io };
};

export default setUpSocket;
