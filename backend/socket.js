// filepath: d:\HOC_TAP\.HK8\KLTN_2025\DEMO_react\backend\socket.js
const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    socket.on("chat", (message) => {
      console.log("Chat message received:", message);
      io.emit("chat", message); // Broadcast the message to all clients
    });

    socket.on("notifi", (notification) => {
      console.log("Notification received:", notification);
      io.emit("notifi", notification); // Broadcast the notification to all clients
    });
  });
};

module.exports = initializeSocket;
