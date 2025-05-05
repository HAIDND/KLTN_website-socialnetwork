const socketIO = require("socket.io");
const socketLiveStream = require("./socketLiveStream");

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  //map user online
  const onlineUsers = new Map();
  // Danh sách các phòng live
  let rooms = {};

  io.on("connection", (socket) => {
    // Kết nối socket cho live stream
    socket.emit("socketId", socket.id); //send socketid to client
    console.log("Socket connected: " + socket.id); //log id
    // set Map user online
    socket.on("userLogin", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("userConnected", userId);
      console.log(`User ${userId} connected with socket ${socket.id}`);
      console.log(onlineUsers);
    });
    socket.on("userLogout", (userId) => {
      onlineUsers.delete(userId, socket.id);
      io.emit("userDisconnected", userId);
      console.log(`❌ User disconnected: ${socket.id}`);
      console.log(onlineUsers);
    });
    // set  user online
    socket.on("checkUserOnline", (userId) => {
      const isOnline = onlineUsers.has(userId);
      socket.emit("checkUserOnline", isOnline);
    });
    //check id to socketid
    socketLiveStream(socket, io, rooms, onlineUsers);
    // Khi frontend gửi friendId, backend gửi lại socketId của friendId
    socket.on("useridtosocketid", (friendId, callback) => {
      const friendSocketId = onlineUsers.get(friendId) || null;
      callback(friendSocketId);
    });
    // socket disconnect
    socket.on("private_message", async ({ senderId, receiverId, message }) => {
      const receiverSocketId = onlineUsers[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("private_message", { senderId, message });
        console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
      } else {
        console.log(`User ${receiverId} is offline.`);
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit("userDisconnected", userId);
          console.log(`❌ User disconnected: ${socket.id}`);
          break;
        }
      }
    });
    //github call
    socket.on(
      "initiateCall",
      ({ targetId, signalData, senderId, senderName }) => {
        io.to(targetId).emit("incomingCall", {
          signal: signalData,
          from: senderId,
          name: senderName,
        });
      }
    );

    socket.on("changeMediaStatus", ({ mediaType, isActive }) => {
      socket.broadcast.emit("mediaStatusChanged", {
        mediaType,
        isActive,
      });
    });

    socket.on("sendMessage", ({ targetId, message, senderName }) => {
      io.to(targetId).emit("receiveMessage", { message, senderName });
    });

    socket.on("answerCall", (data) => {
      socket.broadcast.emit("mediaStatusChanged", {
        mediaType: data.mediaType,
        isActive: data.mediaStatus,
      });
      io.to(data.to).emit("callAnswered", data);
    });

    socket.on("terminateCall", ({ targetId }) => {
      io.to(targetId).emit("callTerminated");
    });
  });
};

module.exports = setupSocket;
