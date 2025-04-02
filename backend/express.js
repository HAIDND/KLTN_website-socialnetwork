const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const friendRoutes = require("./routes/friendRoutes");
const postRoutes = require("./routes/postRoutes");
const groupRoutes = require("./routes/groupRoutes");
const path = require("path");
const chatRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const http = require("http");
const { Server } = require("socket.io");

const corsOptions = {
  origin: "http://localhost:5173", // URL của frontend
  credentials: true, // Cho phép cookie
};

const mongoose = require("mongoose");
const setupSocket = require("./socket");

dotenv.config();

// Kết nối tới MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));

app.use(express.json()); // Xử lý dữ liệu JSON từ raw
app.use(express.urlencoded({ extended: true })); // Xử lý dữ liệu từ form-data

// Route cơ bản
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/chat", chatRoutes); // Prefix /api/chat cho các route chat
app.use("/api/notification", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Socket.io event handling
// const users = {};
// //
// const onlineUsers = new Map();
// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);
//   io.emit("connection", socket.id);
//   socket.on("register", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     console.log(`User ${userId} is online`);
//     users[userId] = socket.id;
//     console.log(`User ${userId} registered with socket ID ${socket.id}`);
//   });
//   //chat video
//   // socket.emit("socketId", socket.id);
//   socket.emit("socketId", socket.id);

//   // socket.on(
//   //   "initiateCall",
//   //   ({ targetId, signalData, senderId, senderName }) => {
//   //     io.to(targetId).emit("incomingCall", {
//   //       signal: signalData,
//   //       from: senderId,
//   //       name: senderName,
//   //     });
//   //   }
//   // );

//   // socket.on("changeMediaStatus", ({ mediaType, isActive }) => {
//   //   socket.broadcast.emit("mediaStatusChanged", {
//   //     mediaType,
//   //     isActive,
//   //   });
//   // });

//   // socket.on("sendMessage", ({ targetId, message, senderName }) => {
//   //   io.to(targetId).emit("receiveMessage", { message, senderName });
//   // });

//   // socket.on("answerCall", (data) => {
//   //   socket.broadcast.emit("mediaStatusChanged", {
//   //     mediaType: data.mediaType,
//   //     isActive: data.mediaStatus,
//   //   });
//   //   io.to(data.to).emit("callAnswered", data);
//   // });

//   // socket.on("terminateCall", ({ targetId }) => {
//   //   io.to(targetId).emit("callTerminated");
//   // });
//   // Nhận tin nhắn từ user A gửi đến user B
//   socket.on("private_message", async ({ senderId, receiverId, message }) => {
//     const receiverSocketId = users[receiverId];

//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("private_message", { senderId, message });
//       console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
//     } else {
//       console.log(`User ${receiverId} is offline.`);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });
// Initialize socket.io
setupSocket(server);
// Khởi động server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
