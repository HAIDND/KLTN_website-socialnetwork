import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { SocketContext } from "./SocketContext";

export const LivestreamContext = createContext();

export const LivestreamProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState([]);
  const [messages, setMessages] = useState([]);
  const streamRef = useRef();

  const startStream = async (roomId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      socket.emit("streamStart", {
        roomId,
        userId: socket.id,
      });

      setIsLive(true);
      return stream;
    } catch (err) {
      console.error("Failed to start stream:", err);
      throw err;
    }
  };

  const stopStream = (roomId) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    socket.emit("endStream", roomId);
    setIsLive(false);
  };

  const joinStream = (roomId) => {
    socket.emit("joinRoom", roomId);
  };

  const sendMessage = (roomId, message, sender, senderName) => {
    socket.emit("liveChat", {
      roomId,
      message,
      sender,
      senderName,
    });
  };

  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("viewerUpdate", ({ viewers }) => {
      setViewers(viewers);
    });

    return () => {
      socket.off("newMessage");
      socket.off("viewerUpdate");
    };
  }, [socket]);

  return (
    <LivestreamContext.Provider
      value={{
        isLive,
        viewers,
        messages,
        startStream,
        stopStream,
        joinStream,
        sendMessage,
        streamRef,
      }}
    >
      {children}
    </LivestreamContext.Provider>
  );
};
