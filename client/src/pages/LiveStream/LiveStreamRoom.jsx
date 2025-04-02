import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  Divider,
  Avatar,
  TextField,
  Badge,
} from "@mui/material";
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  ChatBubble,
  People,
  Close,
  Send,
} from "@mui/icons-material";
import { SocketContext } from "~/context/SocketContext";
import { CurrentUser } from "~/routes/GlobalContext";

const LiveStreamRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { currentUserInfo } = useContext(CurrentUser);
  const videoRef = useRef(null);
  const chatRef = useRef(null);

  const [isStreamer, setIsStreamer] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [isMicActive, setIsMicActive] = useState(true);
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [viewers, setViewers] = useState([]);

  useEffect(() => {
    // Join room
    socket.emit("joinRoom", roomId);

    // Get room info
    socket.on("roomInfo", (info) => {
      setRoomInfo(info);
      setIsStreamer(info.streamerId === currentUserInfo?._id);
    });

    // Handle new viewer
    socket.on("viewerJoined", ({ viewerId, viewers: updatedViewers }) => {
      setViewers(updatedViewers);
    });

    // Handle viewer left
    socket.on("viewerLeft", ({ viewerId, viewers: updatedViewers }) => {
      setViewers(updatedViewers);
    });

    // Handle stream end
    socket.on("streamEnded", () => {
      navigate("/livestream");
    });

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("roomInfo");
      socket.off("viewerJoined");
      socket.off("viewerLeft");
      socket.off("streamEnded");
    };
  }, [roomId, socket]);
  // Handle stream liev chat
  socket.on(
    "liveChat",
    ({ roomId, message, sender, senderName, timestamp }) => {
      setMessages(() => [
        ...messages,
        {
          roomId,
          message,
          sender,
          senderName,
          timestamp,
        },
      ]);
      console.log({ roomId, message, sender, senderName, timestamp });
    }
  );
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit("liveChat", {
      roomId,
      message: newMessage,
      sender: currentUserInfo?._id,
      senderName: currentUserInfo?.username,
      timestamp: new Date(),
    });
    console.log("have new chat");
    setNewMessage("");
  };

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Video Area */}
        <Box sx={{ flex: 1, bgcolor: "black", position: "relative" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isStreamer}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />

          {/* Stream Info Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              p: 2,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={roomInfo?.streamerAvatar} />
              <Typography variant="h6" color="white">
                {roomInfo?.streamerName}
              </Typography>
            </Box>
            <Badge
              badgeContent={viewers?.length}
              color="error"
              sx={{ "& .MuiBadge-badge": { fontSize: "0.8rem" } }}
            >
              <People sx={{ color: "white" }} />
            </Badge>
          </Box>

          {/* Streamer Controls */}
          {isStreamer && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: "rgba(0,0,0,0.6)",
                borderRadius: 2,
                p: 1,
              }}
            >
              <IconButton
                onClick={() => setIsMicActive(!isMicActive)}
                sx={{ color: "white" }}
              >
                {isMicActive ? <Mic /> : <MicOff color="error" />}
              </IconButton>
              <IconButton
                onClick={() => setIsVideoActive(!isVideoActive)}
                sx={{ color: "white" }}
              >
                {isVideoActive ? <Videocam /> : <VideocamOff color="error" />}
              </IconButton>
              <IconButton
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                sx={{ color: "white" }}
              >
                {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
              </IconButton>
            </Stack>
          )}
        </Box>
      </Box>

      {/* Chat Sidebar */}
      <Paper
        sx={{
          width: 350,
          display: "flex",
          flexDirection: "column",
          borderLeft: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Live Chat</Typography>
          <IconButton onClick={() => setShowChat(false)} size="small">
            <Close />
          </IconButton>
        </Box>
        <Divider />

        {/* Messages */}
        <Box
          ref={chatRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
              }}
            >
              <Avatar src={msg.senderAvatar} sx={{ width: 32, height: 32 }} />
              <Box>
                <Typography variant="subtitle2" color="primary">
                  {msg.senderName}
                </Typography>
                <Typography variant="body2">{msg?.message}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Chat Input */}
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            gap: 1,
          }}
        >
          <TextField
            size="small"
            fullWidth
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!newMessage.trim()}
          >
            <Send />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default LiveStreamRoom;
