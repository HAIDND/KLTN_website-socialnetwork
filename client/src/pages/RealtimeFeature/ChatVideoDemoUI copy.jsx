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
import Loading from "../Chatting/Loading/Loading";
import Sidebar from "../DefaultLayout/Sidebar";
import Newsfeed from "../NewFeed";

const caller = {
  avatar: "https://i.pravatar.cc/150?img=1",
  name: "John Doe",
  status: "online",
};

const ChatVideoDemoUI = ({ ifCalled }) => {
  const [inCall, setInCall] = useState(false);
  const [isCalling, setIsCalling] = useState(true);
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
    <>
      {isCalling || inCall ? (
        <Box
          sx={{
            index: 9999,
            position: "fixed",
            top: 0,
            left: 0,
            // display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
          }}
        >
          {/* Khi có cuộc gọi đến */}
          {isCalling && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                p: { xs: 2, sm: 3, md: 4 },
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  textAlign: "center",
                  p: { xs: 2, sm: 3, md: 4 },
                  borderRadius: { xs: 2, sm: 3 },
                  bgcolor: "#222",
                  color: "#fff",
                  width: {
                    xs: "90%", // < 600px
                    sm: "450px", // ≥ 600px
                    md: "500px", // ≥ 900px
                    lg: "550px", // ≥ 1200px
                    xl: "600px", // ≥ 1536px
                  },
                  maxWidth: "95vw",
                }}
              >
                <Avatar
                  src={caller.avatar}
                  sx={{
                    width: { xs: 60, sm: 80, md: 100 },
                    height: { xs: 60, sm: 80, md: 100 },
                    mx: "auto",
                    mb: { xs: 1.5, sm: 2, md: 3 },
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                    mb: { xs: 0.5, sm: 1 },
                  }}
                >
                  {caller.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="gray"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
                    mb: { xs: 1, sm: 2 },
                  }}
                >
                  Đang gọi...
                </Typography>

                <Box sx={{ my: { xs: 1.5, sm: 2, md: 3 } }}>
                  <Loading />
                </Box>

                <Box
                  sx={{
                    mt: { xs: 1.5, sm: 2, md: 3 },
                    display: "flex",
                    justifyContent: "center",
                    gap: { xs: 2, sm: 3, md: 4 },
                  }}
                >
                  <IconButton
                    color="error"
                    onClick={handleRejectCall}
                    sx={{
                      width: { xs: 48, sm: 56, md: 64 },
                      height: { xs: 48, sm: 56, md: 64 },
                      "& .MuiSvgIcon-root": {
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                      },
                      bgcolor: "error.dark",
                      "&:hover": {
                        bgcolor: "error.main",
                      },
                    }}
                  >
                    <CallEnd />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={handleAcceptCall}
                    sx={{
                      width: { xs: 48, sm: 56, md: 64 },
                      height: { xs: 48, sm: 56, md: 64 },
                      "& .MuiSvgIcon-root": {
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                      },
                      bgcolor: "success.dark",
                      "&:hover": {
                        bgcolor: "success.main",
                      },
                    }}
                  >
                    <Call />
                  </IconButton>
                </Box>
              </Paper>
            </Box>
          )}

          {/* Khi đang trong cuộc gọi */}
          {inCall && (
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
              {/* Video của người gọi */}
              <video
                ref={userVideoRef}
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
                ref={callerVideoRef}
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
                <IconButton
                  onClick={toggleMic}
                  color={micOn ? "primary" : "error"}
                >
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
      ) : (
        <>
          <Newsfeed />
        </>
      )}
    </>
  );
};

export default ChatVideoDemoUI;
