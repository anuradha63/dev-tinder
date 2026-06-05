const socketIo = require("socket.io");
const { ChatModel } = require("../models/chat");
const { ConnectionRequestModel } = require("../models/connectionRequest");

const onlineUsers = new Set();

const initialiseSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("registerUser", (userId) => {
      socket.userId = userId;
      socket.join(`user:${userId}`);
      onlineUsers.add(userId);
      io.emit("onlineUsers", Array.from(onlineUsers));
      console.log(`User ${userId} registered. Online: ${onlineUsers.size}`);
    });

    socket.on("getOnlineUsers", () => {
      socket.emit("onlineUsers", Array.from(onlineUsers));
    });

    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("-");
      socket.join(roomId);
      console.log(`Joining room: ${roomId}`);
    });

    socket.on("typing", ({ senderId, targetUserId }) => {
      const roomId = [senderId, targetUserId].sort().join("-");
      socket.to(roomId).emit("userTyping", { senderId });
    });

    socket.on("stopTyping", ({ senderId, targetUserId }) => {
      const roomId = [senderId, targetUserId].sort().join("-");
      socket.to(roomId).emit("userStopTyping", { senderId });
    });

    socket.on("sendMessage", async ({ firstName, lastName, senderId, targetUserId, text }) => {
      try {
        const connection = await ConnectionRequestModel.findOne({
          $or: [
            { fromUserId: senderId, toUserId: targetUserId },
            { fromUserId: targetUserId, toUserId: senderId },
          ],
          status: "accepted",
        });

        if (!connection) throw new Error("No active connection found");

        let chat = await ChatModel.findOne({
          participants: { $all: [senderId, targetUserId] },
        });

        if (!chat) {
          chat = new ChatModel({
            participants: [senderId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({ sender: senderId, text });
        await chat.save();
      } catch (error) {
        console.error("Error saving message:", error);
      }

      const roomId = [senderId, targetUserId].sort().join("-");

      io.to(roomId).emit("messageReceived", {
        firstName, lastName, senderId, text,
      });

      io.to(`user:${targetUserId}`).emit("newMessageNotification", {
        firstName, lastName, senderId, text,
      });
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("onlineUsers", Array.from(onlineUsers));
        console.log(`User ${socket.userId} went offline`);
      }
    });
  });
};

module.exports = { initialiseSocket };
