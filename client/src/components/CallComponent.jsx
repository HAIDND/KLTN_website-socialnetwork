import React, { useState, useRef, useEffect } from "react";
import { Box, Avatar, Typography, IconButton, Paper } from "@mui/material";
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
  FlipCameraIos,
  Call,
} from "@mui/icons-material";

const caller = {
  avatar: "https://i.pravatar.cc/150?img=1",
  name: "John Doe",
  status: "online",
};

const CallComponent = ({}) => {
  const [isCalling, setIsCalling] = useState(true);
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const userVideoRef = useRef(null);
  const callerVideoRef = useRef(null);
  const streamRef = useRef(null);

  const handleAcceptCall = async () => {
    setIsCalling(false);
    setInCall(true);
    await startVideoStream();
  };

  const handleRejectCall = () => {
    setIsCalling(false);
    setInCall(false);
  };

  const toggleMic = () => {
    setMicOn((prev) => !prev);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !micOn;
      });
    }
  };

  const toggleCamera = () => {
    setCameraOn((prev) => !prev);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !cameraOn;
      });
    }
  };

  const switchCamera = async () => {
    setIsFrontCamera((prev) => !prev);
    await startVideoStream(!isFrontCamera);
  };

  const endCall = () => {
    setInCall(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const startVideoStream = async (useFront = true) => {
    try {
      const constraints = {
        video: { facingMode: useFront ? "user" : "environment" },
        audio: true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Lỗi khi truy cập camera/micro:", error);
    }
  };

  useEffect(() => {
    // Fake video stream cho người gọi
    if (callerVideoRef.current) {
      callerVideoRef.current.src = "https://www.w3schools.com/html/mov_bbb.mp4"; // Video mẫu
      callerVideoRef.current.play();
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#000",
      }}
    >
      {/* Khi có cuộc gọi đến */}
      {isCalling && (
        <Paper
          sx={{
            textAlign: "center",
            p: 3,
            borderRadius: 3,
            bgcolor: "#222",
            color: "#fff",
          }}
        >
          <Avatar
            src={caller.avatar}
            sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
          />
          <Typography variant="h6">{caller.name}</Typography>
          <Typography variant="body2" color="gray">
            Đang gọi...
          </Typography>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <IconButton color="error" onClick={handleRejectCall}>
              <CallEnd fontSize="large" />
            </IconButton>
            <IconButton color="success" onClick={handleAcceptCall}>
              <Call fontSize="large" />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Khi đang trong cuộc gọi */}
      {inCall && (
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          {/* Video của người gọi */}
          <video
            ref={callerVideoRef}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />

          {/* Video của người dùng */}
          <video
            ref={userVideoRef}
            autoPlay
            playsInline
            muted={!micOn}
            style={{
              width: "30%",
              height: "30%",
              objectFit: "cover",
              position: "absolute",
              bottom: 20,
              right: 20,
              borderRadius: 10,
              border: "2px solid white",
              transform: isFrontCamera ? "scaleX(1)" : "scaleX(-1)",
            }}
          />

          {/* Overlay các nút điều khiển */}
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 2,
              bgcolor: "rgba(0,0,0,0.6)",
              borderRadius: 5,
              p: 1,
            }}
          >
            <IconButton onClick={toggleMic} color={micOn ? "primary" : "error"}>
              {micOn ? <Mic /> : <MicOff />}
            </IconButton>
            <IconButton
              onClick={toggleCamera}
              color={cameraOn ? "primary" : "error"}
            >
              {cameraOn ? <Videocam /> : <VideocamOff />}
            </IconButton>
            <IconButton onClick={switchCamera} color="warning">
              <FlipCameraIos />
            </IconButton>
            <IconButton onClick={endCall} color="error">
              <CallEnd />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CallComponent;
