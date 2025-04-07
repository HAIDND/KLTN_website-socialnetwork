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
  CallEnd,
  ExitToApp,
} from "@mui/icons-material";
import { SocketContext } from "~/context/SocketContext";
import { CurrentUser } from "~/routes/GlobalContext";
import { VideoCallContext } from "~/context/VideoCallContext";

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
  // Add these after existing useRef declarations
  const peerRef = useRef();
  const streamRef = useRef();
  const [stream, setStream] = useState(null);

  // Add these after existing useState declarations
  const [peers, setPeers] = useState({});
  const [error, setError] = useState(null);
  const { startLiveStream, joinLiveStream, myVideoRef, partnerVideoRef } =
    useContext(VideoCallContext);
  useEffect(() => {
    // Join room
    socket.emit("joinRoom", roomId);
    joinLiveStream(roomId);
    // Get room info
    socket.on("roomInfo", (info) => {
      console.log(info);
      setRoomInfo(info);
      setIsStreamer(info.owner === currentUserInfo?.email);
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
      if (isStreamer) {
        socket.emit("endLive", roomId);
      }
      socket.off("roomInfo");
      socket.off("viewerJoined");
      socket.off("viewerLeft");
      socket.off("streamEnded");
    };
  }, [roomId, socket]);
  //handle viewer leave room
  function handleViewerLeftRoom() {
    socket.emit("leaveRoom", roomId);
    navigate("/livestream");
  }
  //handle viewer leave room
  function handleOwnerEndRoom() {
    if (confirm("Are you sure you want to end the stream?"))
      socket.emit("endLive", roomId);
    else return 0;
  }

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
  // Add this after the existing useEffect hooks
  useEffect(() => {
    if (isStreamer) {
      // Get user media for streamer
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          streamRef.current = mediaStream;
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }

          // Notify server that stream is ready
          socket.emit("streamReady", { roomId });
        })
        .catch((err) => {
          console.error("Failed to get media devices:", err);
          setError("Failed to access camera and microphone");
        });
    }

    // Handle new viewer connection
    socket.on("viewerConnected", ({ viewerId }) => {
      if (!isStreamer) return;

      const peer = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" },
        ],
      });

      // Add tracks to peer connection
      streamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, streamRef.current);
      });

      // Handle ICE candidates
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", {
            candidate: event.candidate,
            viewerId,
            roomId,
          });
        }
      };

      // Create and send offer
      peer
        .createOffer()
        .then((offer) => peer.setLocalDescription(offer))
        .then(() => {
          socket.emit("streamOffer", {
            offer: peer.localDescription,
            viewerId,
            roomId,
          });
        });

      setPeers((prev) => ({ ...prev, [viewerId]: peer }));
    });

    // Handle viewer disconnection
    socket.on("viewerDisconnected", ({ viewerId }) => {
      if (peers[viewerId]) {
        peers[viewerId].close();
        setPeers((prev) => {
          const newPeers = { ...prev };
          delete newPeers[viewerId];
          return newPeers;
        });
      }
    });

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      Object.values(peers).forEach((peer) => peer.close());
      socket.off("viewerConnected");
      socket.off("viewerDisconnected");
    };
  }, [isStreamer, roomId]);

  // Add viewer connection logic
  useEffect(() => {
    if (isStreamer) return;

    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
      ],
    });

    // Handle incoming stream
    peer.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          candidate: event.candidate,
          roomId,
          streamerId: roomInfo?.streamerId,
        });
      }
    };

    // Handle offer from streamer
    socket.on("streamOffer", async ({ offer }) => {
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("streamAnswer", {
        answer,
        roomId,
        streamerId: roomInfo?.streamerId,
      });
    });

    // Handle ICE candidates
    socket.on("iceCandidate", async ({ candidate }) => {
      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    peerRef.current = peer;

    return () => {
      if (peer) {
        peer.close();
      }
      socket.off("streamOffer");
      socket.off("iceCandidate");
    };
  }, [!isStreamer && roomInfo?.streamerId]);
  // Add these after existing state declarations
  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicActive;
        setIsMicActive(!isMicActive);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoActive;
        setIsVideoActive(!isVideoActive);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        const videoTrack = displayStream.getVideoTracks()[0];

        Object.values(peers).forEach((peer) => {
          const sender = peer
            .getSenders()
            .find((s) => s.track.kind === "video");
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        videoTrack.onended = () => {
          toggleScreenShare();
        };

        if (videoRef.current) {
          videoRef.current.srcObject = displayStream;
        }
      } else {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const videoTrack = userStream.getVideoTracks()[0];

        Object.values(peers).forEach((peer) => {
          const sender = peer
            .getSenders()
            .find((s) => s.track.kind === "video");
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };
  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Video Area */}
        <Box sx={{ flex: 1, bgcolor: "black", position: "relative" }}>
          {isStreamer ? (
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
          ) : (
            <video
              ref={partnerVideoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          )}

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
          {isStreamer ? (
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
              {/* // Update the control buttons section */}
              <IconButton onClick={toggleMic} sx={{ color: "white" }}>
                {isMicActive ? <Mic /> : <MicOff color="error" />}
              </IconButton>
              <IconButton onClick={toggleVideo} sx={{ color: "white" }}>
                {isVideoActive ? <Videocam /> : <VideocamOff color="error" />}
              </IconButton>
              <IconButton onClick={toggleScreenShare} sx={{ color: "white" }}>
                {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
              </IconButton>
              <IconButton onClick={handleOwnerEndRoom} sx={{ color: "white" }}>
                {isScreenSharing ? <CallEnd /> : <CallEnd />}
              </IconButton>
            </Stack>
          ) : (
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
                onClick={handleViewerLeftRoom}
                sx={{ color: "white" }}
              >
                <ExitToApp />
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
