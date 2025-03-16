import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import {
  getChatWithUser,
  sendMessage,
} from "~/services/chatServices/chatService";
import { CurrentUser } from "~/routes/GlobalContext";
import CallVideos from "~/pages/Chatting/CallVideos";
import io from "socket.io-client";
import notificationSound from "../../../public/RingNotifi/notifymoe.mp3";
// Import the notification sound notification18.mp3

// const socket = io(`http://localhost:5000`);
const ChatRealtimeWindow = ({ onClose }) => {
  const { currentUserInfo } = useContext(CurrentUser);
  console.log(currentUserInfo);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ifCall, setIfCall] = useState(false);
  const messagesEndRef = useRef(null);
  const friend = currentUserInfo;
  //on have new mes
  const audio = new Audio(notificationSound);
  const [listUser, setListUser] = useState([]);
  const [userID, setUserID] = useState(null);
  setUserID(currentUserInfo?._id);
  // socket.emit("register", userID);
  // socket.on(
  //   "message",
  //   (mess) => setMessages([...messages, mess])
  // audio.play()
  // );
  socket.on("connection", (user) => setListUser([...listUser, user]));
  //effect chat
  useEffect(() => {
    socket.emit("register", userID);
    socket.on(
      "message",
      (mess) => setMessages([...messages, mess])
      // audio.play()
    );
  }, []);
  //efect
  useEffect(() => {
    let isMounted = true;
    const fetchChatList = async () => {
      try {
        const data = await getChatWithUser(friend?._id);
        if (isMounted) {
          setMessages(data);
          scrollToBottom();
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };
    fetchChatList();
    // const interval = setInterval(fetchChatList, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(friend?._id, newMessage);
    setNewMessage("");
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        senderId: currentUserInfo?.userId,
        content: newMessage,
        createdAt: new Date().toISOString(),
      },
    ]);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return ifCall ? (
    <CallVideos ifCall={ifCall} />
  ) : (
    <Box
      component={Paper}
      elevation={4}
      sx={{
        position: "fixed",
        right: 50,
        bottom: 0,
        width: 400,
        maxHeight: 500,
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 1.5,
          borderBottom: "1px solid #ddd",
          backgroundColor: "#f1f1f1",
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            src={friend?.avatar}
            alt="User Avatar"
            sx={{ width: 40, height: 40, marginRight: 1 }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
              {friend?.username}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "green",
                  marginRight: 1,
                }}
              />
              Active now
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={() => setIfCall(!ifCall)} sx={{ color: "blue" }}>
          <VideoCallIcon />
        </IconButton>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          backgroundColor: "#fafafa",
        }}
      >
        {messages.length > 0 &&
          messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  message.senderId === currentUserInfo?.userId
                    ? "flex-end"
                    : "flex-start",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  maxWidth: "70%",
                  padding: 1.5,
                  borderRadius: 2,
                  backgroundColor:
                    message.senderId === currentUserInfo?.userId
                      ? "#0866ff"
                      : "#e4e6eb",
                  color:
                    message.senderId === currentUserInfo?.userId
                      ? "white"
                      : "black",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  wordBreak: "break-word",
                }}
              >
                <Typography variant="body2">{message?.content}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 10,
                    display: "block",
                    textAlign: "right",
                    marginTop: 0.5,
                    color: "black",
                  }}
                >
                  {message?.createdAt}
                </Typography>
              </Box>
            </Box>
          ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 1.5,
          borderTop: "1px solid #ddd",
          backgroundColor: "#fff",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          size="small"
          variant="outlined"
          sx={{ marginRight: 1, borderRadius: "20px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{
            borderRadius: "50%",
            minWidth: "auto",
            padding: "8px",
            backgroundColor: "#1877f2",
            "&:hover": { backgroundColor: "#166fe5" },
          }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default ChatRealtimeWindow;
