function socketLiveStream(socket, io, liveRooms) {
  // Khi một người tạo phòng live
  socket.on("createRoom", ({ roomId, streamerName }) => {
    socket.join(roomId);
    liveRooms[roomId] = { streamer: streamerName, viewers: [], id: roomId };
    io.emit("updateLiveRooms", Object.values(liveRooms)); // Cập nhật danh sách phòng
  });

  // Khi một người vào xem live
  socket.on("joinRoom", (roomId) => {
    if (liveRooms[roomId]) {
      socket.join(roomId);
      liveRooms[roomId].viewers.push(socket.id);
      io.to(roomId).emit("viewerJoined", socket.id);
    }
  });

  // Khi một người rời phòng
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    if (liveRooms[roomId]) {
      liveRooms[roomId].viewers = liveRooms[roomId].viewers.filter(
        (id) => id !== socket.id
      );
      if (liveRooms[roomId].viewers.length === 0 && socket.id === roomId) {
        delete liveRooms[roomId]; // Xóa phòng nếu không còn ai
      }
      io.emit("updateLiveRooms", Object.values(liveRooms));
    }
  });

  // Khi một streamer kết thúc live
  socket.on("endLive", (roomId) => {
    delete liveRooms[roomId];
    io.emit("updateLiveRooms", Object.values(liveRooms));
  });

  // Khi user ngắt kết nối
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    for (let room in liveRooms) {
      liveRooms[room].viewers = liveRooms[room].viewers.filter(
        (id) => id !== socket.id
      );
      if (room === socket.id) delete liveRooms[room]; // Xóa phòng nếu streamer rời đi
    }
    io.emit("updateLiveRooms", Object.values(liveRooms));
  });
}
module.exports = socketLiveStream;
