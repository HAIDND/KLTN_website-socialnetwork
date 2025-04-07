function socketLiveStream(socket, io, liveRooms) {
  const updateRooms = () =>
    io.emit("updateLiveRooms", Object.values(liveRooms));

  const handleCreateRoom = ({ owner, roomId, streamerName }) => {
    socket.join(roomId);
    liveRooms[roomId] = {
      owner: owner,
      id: roomId,
      streamer: streamerName,
      viewers: [],
      startTime: new Date(),
    };
    updateRooms();
    console.log("liveRooms", liveRooms);
  };

  const handleJoinRoom = (roomId) => {
    const room = liveRooms[roomId];
    if (room) {
      socket.join(roomId);
      room.viewers.push({
        id: socket.id,
        joinTime: new Date(),
      });
      io.to(roomId).emit("viewerJoined", {
        viewerId: socket.id,
        count: room.viewers.length,
      });
      console.log("join room", liveRooms[roomId].viewers);
      io.to(roomId).emit("roomInfo", room);
    }
  };

  const handleLeaveRoom = (roomId) => {
    const room = liveRooms[roomId];
    if (!room) return;

    socket.leave(roomId);
    room.viewers = room.viewers.filter((viewer) => viewer.id !== socket.id);

    if (room.viewers.length === 0 && socket.id === roomId) {
      delete liveRooms[roomId];
    }
    console.log("leave room", liveRooms[roomId].viewers);
    updateRooms();
  };

  const handleDisconnect = () => {
    Object.keys(liveRooms).forEach((roomId) => {
      const room = liveRooms[roomId];
      room.viewers = room.viewers.filter((viewer) => viewer.id !== socket.id);

      if (roomId === socket.id) {
        delete liveRooms[roomId];
        io.to(roomId).emit("streamEnded", { roomId });
      }
    });
    updateRooms();
  };
  socket.on(
    "liveChat",
    ({ roomId, message, sender, senderName, timestamp }) => {
      console.log("have chat", message);
      io.to(roomId).emit("liveChat", {
        roomId,
        message,
        sender,
        senderName,
        timestamp,
      });
    }
  );
  // Event listeners
  socket.on("getLiveRooms", () => {
    io.emit("updateLiveRooms", Object.values(liveRooms));
  });
  socket.on("createRoom", handleCreateRoom);
  socket.on("joinRoom", handleJoinRoom);
  socket.on("leaveRoom", handleLeaveRoom);
  socket.on("userLogout", (roomId) => {
    console.log("userLogout", roomId);
    delete liveRooms[roomId];
    io.to(roomId).emit("streamEnded", { roomId });
    updateRooms();
  });
  socket.on("endLive", (roomId) => {
    delete liveRooms[roomId];
    io.to(roomId).emit("streamEnded", { roomId });
    updateRooms();
  });
  socket.on("disconnect", handleDisconnect);

  ///add livestrea,feature

  socket.on("hostSignal", ({ roomId, signalData }) => {
    io.to(roomId).emit("receiveHostSignal", { signalData });
  });

  socket.on("viewerSignal", ({ roomId, signal }) => {
    io.to(liveRooms[roomId]).emit("connectViewer", { signal });
  });
}

module.exports = socketLiveStream;
