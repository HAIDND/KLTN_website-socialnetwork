import React, { useState, useRef, useEffect, useContext } from "react";
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
import { CurrentUser } from "~/routes/GlobalContext";
import Peer from "simple-peer";

// const socket = io("http://localhost:5000");

const CallVideos = ({ friendCall }) => {
  const { currentUserInfo } = useContext(CurrentUser);
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callerSignal, setCallerSignal] = useState(null);
  const [caller, setCaller] = useState("");
  const [name, setName] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    // Register user with socket
    socket.emit("register", currentUserInfo._id);

    // Get media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    // Listen for incoming calls
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    return () => {
      // Cleanup
      socket.off("callUser");
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [currentUserInfo._id]);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: friendCall._id,
        signalData: data,
        from: currentUserInfo._id,
        name: currentUserInfo.username,
      });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    setReceivingCall(false);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    setCallAccepted(false);
    setReceivingCall(false);

    if (connectionRef.current) {
      connectionRef.current.destroy();
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    socket.emit("endCall", { to: friendCall._id });
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        zIndex: 9999,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Main video area */}
        <Box sx={{ flex: 1, position: "relative" }}>
          {stream && (
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {callAccepted && (
            <video
              playsInline
              ref={userVideo}
              autoPlay
              style={{
                position: "absolute",
                width: "30%",
                height: "30%",
                bottom: 20,
                right: 20,
                borderRadius: "10px",
                border: "2px solid white",
              }}
            />
          )}
        </Box>

        {/* Controls */}
        <Box
          sx={{
            padding: 2,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            gap: 2,
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

          {!callAccepted && !receivingCall && (
            <IconButton onClick={callUser} color="primary">
              <Call />
            </IconButton>
          )}

          {receivingCall && !callAccepted && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body1" color="white">
                {name} is calling...
              </Typography>
              <IconButton onClick={answerCall} color="success">
                <Call />
              </IconButton>
            </Box>
          )}

          {(callAccepted || receivingCall) && (
            <IconButton onClick={leaveCall} color="error">
              <CallEnd />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CallVideos;
