import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
} from "@mui/material";
import { Container } from "react-bootstrap";
import socket from "~/context/SocketInitial";
import Peer from "simple-peer";
export default function LiveStreamCard({ user }) {
  const [roomId, setRoomId] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [liveRooms, setLiveRooms] = useState([]);
  const [stream, setStream] = useState(null);
  const videoRef = useRef();
  const peerRef = useRef(null);

  useEffect(() => {
    socket.on("updateLiveRooms", (rooms) => {
      setLiveRooms(rooms);
    });

    socket.on("viewerJoined", (viewerId) => {
      if (peerRef.current) {
        peerRef.current.signal(viewerId);
      }
    });
  }, []);

  // Mở phòng live stream
  const startLive = async () => {
    const userStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720, frameRate: 30 },
      audio: true,
    });

    setStream(userStream);
    videoRef.current.srcObject = userStream;
    setIsStreaming(true);

    socket.emit("createRoom", { roomId, streamerName: "Streamer" });

    peerRef.current = new Peer({
      initiator: true,
      trickle: false,
      stream: userStream,
    });
    peerRef.current.on("signal", (signal) => {
      socket.emit("signal", { to: socket.id, signal });
    });
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
    <Container>
      <Typography variant="h4">Live Stream App</Typography>
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
      {/* card video */}
      <Card sx={{ maxWidth: 320, borderRadius: 3, boxShadow: 3, padding: 1 }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", borderRadius: "10px" }}
        />
        <Typography variant="h5" style={{ marginTop: 20 }}>
          Phòng Live:
        </Typography>
        <List>
          {liveRooms.map((room) => (
            <ListItem key={room.id}>
              <Button variant="outlined" onClick={() => watchLive(room.id)}>
                Xem {room.streamer}
              </Button>
            </ListItem>
          ))}
        </List>
        {/* <ChatVideoDemoUI /> */}
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            {user.name}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
