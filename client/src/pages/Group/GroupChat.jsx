import { Close, Send } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { CurrentUser } from "~/context/GlobalContext";
import socket from "~/context/SocketInitial";

function GroupChat() {
  const chatRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { currentUserInfo } = useContext(CurrentUser);

  const { id } = useParams();

  useEffect(() => {
    socket.emit("createGroupRoom", {
      groupId: id,
      memberId: currentUserInfo?.email,
    });
    socket.emit("joinRoom", {
      groupId: id,
      memberId: currentUserInfo?.email,
    });

    // Gửi tin nhắn
    // socket.emit("groupChat", {
    //   groupId: id,
    //   message: "Hello group!",
    //   senderId: currentUserInfo?.email,
    //   senderName: currentUserInfo?.username,
    // });

    // Nghe nhận tin nhắn realtime
    socket.on("groupChat", ({ groupId, message, senderName }) => {
      console.log(`[${groupId}] ${senderName}: ${message}`);
      setMessages((prev) => [
        ...prev,
        {
          message,
          senderName,
        },
      ]);
    });
    return () => {
      socket.off("groupChat");
      socket.emit("leaveRoom", {
        groupId: id,
      });
    };
  }, []);

  //send messs
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    //   await sendMessage(friend?.email, newMessage);
    // socket.emit("groupChat", {
    //   senderEmail: currentUserInfo?.email,
    //   receiverEmail: friend?.email,
    //   message: newMessage,
    //   createdAt: new Date().toISOString(),
    // });
    socket.emit("groupChat", {
      groupId: id,
      message: newMessage,
      senderId: currentUserInfo?.email,
      senderName: currentUserInfo?.username,
    });
    setNewMessage("");
    //   setMessages((messages) => [
    //     ...messages,
    //     {
    //       content: newMessage,
    //       createdAt: new Date().toISOString(),
    //       senderId: currentUserInfo._id,
    //       // senderId: senderId,
    //     },
    //   ]);
  };
  //   useEffect(() => {
  //     const handleLiveChat = ({
  //       roomId,
  //       message,
  //       sender,
  //       senderName,
  //       timestamp,
  //     }) => {
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           roomId,
  //           message,
  //           sender,
  //           senderName,
  //           timestamp,
  //         },
  //       ]);
  //     };

  //     socket.on("liveChat", handleLiveChat);
  //     return () => socket.off("liveChat", handleLiveChat);
  //   }, []);

  //   const handleSendMessage = (e) => {
  //     e.preventDefault();
  //     if (!newMessage.trim()) return;

  //     socket.emit("liveChat", {
  //       roomId,
  //       message: newMessage,
  //       sender: currentUserInfo?._id,
  //       senderName: currentUserInfo?.username,
  //       timestamp: new Date(),
  //     });
  //     console.log("have new chat");
  //     setNewMessage("");
  //   };
  return (
    <div>
      {" "}
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
              <Avatar src={msg?.senderAvatar} sx={{ width: 32, height: 32 }} />
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
    </div>
  );
}
export default GroupChat;
