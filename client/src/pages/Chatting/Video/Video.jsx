import React, { useContext, useState, useEffect } from "react";
import { VideoCallContext } from "~/context/Context";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  Paper,
  Badge,
  Avatar as MuiAvatar,
} from "@mui/material";
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
  Message,
  ScreenShare,
  Person,
  VolumeOff,
} from "@mui/icons-material";
// import { socket } from "~/config/apiConfig";
import Loading from "../Loading/Loading";
import ChatModal from "../Chat/Chat";
import { SocketContext } from "~/context/SocketContext";
const Video = () => {
  const socket = useContext(SocketContext);
  const {
    call,
    isCallAccepted,
    myVideoRef,
    partnerVideoRef,
    userStream,
    name,
    isCallEnded,
    sendMessage: sendMessageFunc,
    receivedMessage,
    chatMessages,
    setChatMessages,
    endCall,
    opponentName,
    isMyVideoActive,
    isPartnerVideoActive,
    toggleVideo,
    isMyMicActive,
    isPartnerMicActive,
    toggleMicrophone,
    toggleFullScreen,
    toggleScreenSharingMode,
  } = useContext(VideoCallContext);

  const [sendMessage, setSendMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    const handleMessage = ({ message, senderName }) => {
      const newMessage = {
        message,
        type: "received",
        senderName,
        timestamp: Date.now(),
      };

      setChatMessages((prev) => [...prev, newMessage]);
      if (!isModalVisible) {
        setHasUnreadMessages(true);
      }
    };

    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, [setChatMessages, isModalVisible]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    if (!isModalVisible) {
      setHasUnreadMessages(false);
    }
  };

  const onSearch = (message) => {
    if (message) {
      sendMessageFunc(message);
      setSendMessage("");
    }
  };

  const VideoPanel = ({
    isMyVideo,
    videoRef,
    userName,
    isVideoActive,
    isMicActive,
  }) => (
    <Paper
      elevation={3}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 300,
        bgcolor: "background.default",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          color: "white",
          zIndex: 1,
          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
        }}
      >
        {userName || "Name"}
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <video
          playsInline
          muted={isMyVideo}
          ref={videoRef}
          onClick={toggleFullScreen}
          autoPlay
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isVideoActive ? 1 : 0,
          }}
        />

        <MuiAvatar
          sx={{
            position: "absolute",
            width: 100,
            height: 100,
            opacity: isVideoActive ? 0 : 1,
            transition: "opacity 0.3s",
            bgcolor: "primary.main",
          }}
        >
          {userName?.[0]?.toUpperCase() || <Person sx={{ fontSize: 45 }} />}
        </MuiAvatar>

        {!isMicActive && (
          <VolumeOff
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              fontSize: 42,
              color: "error.main",
            }}
          />
        )}
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {userStream ? (
          <Grid item xs={12} md={isCallAccepted ? 6 : 12}>
            <VideoPanel
              isMyVideo={true}
              videoRef={myVideoRef}
              userName={name}
              isVideoActive={isMyVideoActive}
              isMicActive={isMyMicActive}
            />
          </Grid>
        ) : (
          <Loading />
        )}

        {isCallAccepted && !isCallEnded && partnerVideoRef && (
          <Grid item xs={12} md={6}>
            <VideoPanel
              isMyVideo={false}
              videoRef={partnerVideoRef}
              userName={call.name || opponentName}
              isVideoActive={isPartnerVideoActive}
              isMicActive={isPartnerMicActive}
            />
          </Grid>
        )}
      </Grid>

      {userStream && (
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 2,
            bgcolor: "rgba(0,0,0,0.5)",
            borderRadius: 8,
            p: 1,
          }}
        >
          <IconButton
            onClick={toggleMicrophone}
            color={isMyMicActive ? "primary" : "error"}
          >
            {isMyMicActive ? <Mic /> : <MicOff />}
          </IconButton>

          <IconButton
            onClick={toggleVideo}
            color={isMyVideoActive ? "primary" : "error"}
          >
            {isMyVideoActive ? <Videocam /> : <VideocamOff />}
          </IconButton>

          {isCallAccepted && !isCallEnded && (
            <>
              <IconButton color="primary" onClick={toggleScreenSharingMode}>
                <ScreenShare />
              </IconButton>

              <IconButton color="primary" onClick={toggleModal}>
                <Badge
                  color="error"
                  variant="dot"
                  invisible={!hasUnreadMessages}
                >
                  <Message />
                </Badge>
              </IconButton>

              <IconButton
                color="error"
                onClick={endCall}
                sx={{
                  bgcolor: "error.main",
                  "&:hover": { bgcolor: "error.dark" },
                }}
              >
                <CallEnd />
              </IconButton>
            </>
          )}
        </Box>
      )}

      <ChatModal
        isVisible={isModalVisible}
        toggleModal={toggleModal}
        chatMessages={chatMessages}
        sendMessage={sendMessage}
        setSendMessage={setSendMessage}
        onSearch={onSearch}
        receivedMessage={receivedMessage}
      />
    </Box>
  );
};

export default Video;
