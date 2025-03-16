import { useState } from "react";
import { Avatar, Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { Close, Send, VideoCall, Image } from "@mui/icons-material";

const ChatWindow = ({  onClose, onCall }) => {
  const user = {
    name: "User 1",
    avatar: "https://tse2.mm.bing.net/th?id=OIP.uv356bS3V2vPqq09778PGAHaLH&pid=Api&P=0&h=180",
  }
  const [messages, setMessages] = useState([
    { id: 1, sender: "me", text: "Hello!", time: "10:00 AM" },
    { id: 2, sender: "other", text: "Hi there!", time: "10:01 AM" },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: "me", text: message, time: "Now" }]);
      setMessage("");
    }
  };

  return (
    <Box sx={{
      width: 350,
      height: 500,
      display: "flex",
      flexDirection: "column",
      borderRadius: 2,
      boxShadow: 3,
      bgcolor: "background.paper",
    }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 2,p: 1, bgcolor: "primary.main", color: "white" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={user?.avatar} sx={{ mr: 1 }} />
          <Typography>{user?.name}</Typography>
        </Box>
        <Box>
          <IconButton onClick={onCall} sx={{ color: "red" }}><VideoCall /></IconButton>
          <IconButton onClick={onClose} sx={{ color: "red" }}><Close /></IconButton>
        </Box>
      </Box>
      
      {/* Messages */}
      <Box sx={{ flex: 1, p: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {messages.map(msg => (
          <Box key={msg.id} sx={{
            alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
            bgcolor: msg.sender === "me" ? "secondary.main" : "grey.300",
            color: msg.sender === "me" ? "white" : "black",
            p: 1,
            borderRadius: 2,
            m: 0.5,
            maxWidth: "75%"
          }}>
            <Typography variant="body2">{msg.text}</Typography>
            <Typography variant="caption" sx={{ display: "block", textAlign: "right", fontSize: "0.7rem" }}>{msg.time}</Typography>
          </Box>
        ))}
      </Box>
      
      {/* Input */}
      <Box sx={{ display: "flex", alignItems: "center", p: 1, borderTop: "1px solid grey" }}>
        <IconButton><Image color="primary" /></IconButton>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <IconButton onClick={sendMessage}><Send color="primary" /></IconButton>
      </Box>
    </Box>
  );
};

export default ChatWindow;
