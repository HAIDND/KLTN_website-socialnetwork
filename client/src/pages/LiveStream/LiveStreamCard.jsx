import { useContext, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  List,
  ListItem,
} from "@mui/material";
import { VideoCallContext } from "~/context/VideoCallContext";
import socket from "~/context/SocketInitial";
import Peer from "simple-peer";
export default function LiveStreamCard({}) {
  const user = { id: 2, name: "User 2" };
  const { myVideoRef, userStream } = useContext(VideoCallContext);
  const [roomId, setRoomId] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [liveRooms, setLiveRooms] = useState([]);
  const [stream, setStream] = useState(myVideoRef);
  const videoRef = useRef();
  const peerRef = useRef(null);

  ///logic
  // Mở phòng live stream
  const startLive = async () => {
    setIsStreaming(true);

    try {
      // Create peer with required options
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: userStream,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
              urls: "turn:numb.viagenie.ca",
              username: "webrtc@live.com",
              credential: "muazkh",
            },
          ],
        },
        objectMode: true, // Add this to fix the 'call' property error
      });
      socket.emit("createRoom", { roomId, streamerName: "Streamer" });

      peerRef.current = new Peer({
        initiator: true,
        trickle: false,
        stream: myVideoRef,
      });
      peerRef.current.on("signal", (signal) => {
        socket.emit("signal", { to: socket.id, signal });
      });
      // Set partner ID first
      setPartnerUserId(targetId);

      // Handle peer events
      peer.on("signal", (data) => {
        console.log("Signaling:", data);
        socket.emit("initiateCall", {
          targetId,
          signalData: data,
          senderId: myUserId,
          senderName: name,
        });
      });

      peer.on("connect", () => {
        console.log("Peer connection established");
      });

      peer.on("stream", (remoteStream) => {
        console.log("Received remote stream");
        if (partnerVideoRef.current) {
          partnerVideoRef.current.srcObject = remoteStream;
        }
      });

      peer.on("error", (err) => {
        console.error("Peer connection error:", err);
        endCall();
      });

      peer.on("close", () => {
        console.log("Peer connection closed");
        endCall();
      });

      // Handle call acceptance
      socket.on("callAnswered", ({ signal, userName }) => {
        console.log("Call answered by:", userName);
        setIsCallAccepted(true);
        setOpponentName(userName);

        if (peer && !peer.destroyed) {
          peer.signal(signal);
        }
      });

      // Store peer reference
      peerConnectionRef.current = peer;

      return peer;
    } catch (error) {
      console.error("Error creating peer:", error);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.destroy();
      }
      throw error;
    }
  };

  // Xem live stream
  const watchLive = (roomId) => {
    socket.emit("joinRoom", roomId);

    peerRef.current = new Peer({ initiator: false, trickle: false });
    peerRef.current.on("signal", (signal) => {
      socket.emit("signal", { to: roomId, signal });
    });

    peerRef.current.on("stream", (remoteStream) => {
      videoRef.current.srcObject = remoteStream;
    });
  };
  return (
    <Card sx={{ maxWidth: 320, borderRadius: 3, boxShadow: 3, padding: 1 }}>
      <TextField
        label="Nhập ID phòng"
        variant="outlined"
        fullWidth
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={startLive}
        disabled={isStreaming}
      >
        Bắt đầu Live
      </Button>
      <video
        ref={myVideoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", borderRadius: "10px" }}
      />
      {/* <ChatVideoDemoUI /> */}
      <CardContent>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          {user.name}
        </Typography>
      </CardContent>
      <List>
        {liveRooms.map((room) => (
          <ListItem key={room.id}>
            <Button variant="outlined" onClick={() => watchLive(room.id)}>
              Xem {room.streamer}
            </Button>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
