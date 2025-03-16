//
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const friendRoutes = require("./routes/friendRoutes");
const postRoutes = require("./routes/postRoutes");
const groupRoutes = require("./routes/groupRoutes");
const path = require("path");
const chatRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
//
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

const { availableParallelism } = require("node:os");
const cluster = require("node:cluster");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");
if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  // create one worker per available core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 5000 + i,
    });
    console.log(`Worker ${i} run`);
  }

  // set up the adapter on the primary thread
  setupPrimary();
} else {
  // const app = express();
  //   const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},

    cors: {
      origin: "http://localhost:5173/",
      credentials: true, // Cho phép cookie
      // methods: ["GET", "POST"],
    },
    // set up the adapter on each worker thread
    adapter: createAdapter(),
  });
  const corsOptions = {
    origin: "http://localhost:5173/", // URL của frontend  ["http://localhost:5173/", "http://localhost:3000"],
    credentials: true, // Cho phép cookie
  };
  app.use(cors(corsOptions));
  const users = {};

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    io.emit("connection", socket.id);
    socket.on("register", (userId) => {
      users[userId] = socket.id;
      console.log(`User ${userId} registered with socket ID ${socket.id}`);
    });

    // Nhận tin nhắn từ user A gửi đến user B
    socket.on("private_message", async ({ senderId, receiverId, message }) => {
      const receiverSocketId = users[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("private_message", { senderId, message });
        console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
      } else {
        console.log(`User ${receiverId} is offline.`);
      }
    });
    // socket.emit("message", "ss");
    // socket.on("callUser", ({ userToCall, signalData, from }) => {
    //   io.to(userToCall).emit("callIncoming", { from, signal: signalData });
    // });

    // socket.on("acceptCall", ({ signal, to }) => {
    //   io.to(to).emit("callAccepted", signal);
    // });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  server.listen(process.env.PORT, () =>
    console.log(`Worker ${process.pid} running on port ${process.env.PORT}`)
  );
}

// app.use(cors());
const corsOptions = {
  origin: "http://localhost:300", // URL của frontend
  credentials: true, // Cho phép cookie
};
app.use(cors(corsOptions));

dotenv.config();

// Kết nối tới MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

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

// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// },{
//    connectionStateRecovery: {}
//  });

//io

// const dotenv = require('dotenv');
// dotenv.config();
const PORT = process.env.PORT;
// server.listen(PORT, () => console.log("Server running on port " + PORT));

///old
// const cors = require('cors');
// const dotenv = require('dotenv');
// const userRoutes = require('./routes/userRoutes');
// const friendRoutes = require('./routes/friendRoutes');
// const postRoutes = require('./routes/postRoutes');
// const groupRoutes  = require('./routes/groupRoutes');
// const path = require('path');
// const chatRoutes = require('./routes/messageRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// const corsOptions = {
//    origin: '*', // URL của frontend
//    credentials: true, // Cho phép cookie
// };

// const mongoose = require('mongoose');

// dotenv.config();

// // Kết nối tới MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch((error) => console.error('MongoDB connection error:', error));

// const app = express();
// ///add
// const socketIo = require("socket.io");
// const http = require("http");

// const server = http.createServer(app);
// const io = socketIo(server, {
//    cors: {
//        origin: "http://localhost:3000/", // Hoặc chỉ định cụ thể frontend của bạn
//        methods: ["GET", "POST"]
//    }
// });
// module.exports.io = io;
// // Xử lý kết nối socket
// io.on("connection", (socket) => {
//    console.log("A user connected:", socket.id);

//    // Nhận userId từ client để tham gia phòng riêng
//    socket.on("join", (userId) => {
//        socket.join(userId);
//        console.log(`User ${userId} joined room`);
//    });

//    socket.on("disconnect", () => {
//        console.log("User disconnected:", socket.id);
//    });
// });
// //adđ

// const PORT = process.env.PORT || 5000;

// app.use(cors(corsOptions));

// app.use(express.json()); // Xử lý dữ liệu JSON từ raw
// app.use(express.urlencoded({ extended: true })); // Xử lý dữ liệu từ form-data

// // Route cơ bản
// app.get('/', (req, res) => {
//    res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.use('/api/users', userRoutes);
// app.use('/api/friends', friendRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/groups', groupRoutes);
// app.use('/api/chat', chatRoutes); // Prefix /api/chat cho các route chat

// app.use('/api/notification', notificationRoutes);

// app.use('/api/admin', adminRoutes);

// // Khởi động server
// app.listen(PORT, () => {
//    console.log(`Server is running on http://localhost:${PORT}`);
// });
