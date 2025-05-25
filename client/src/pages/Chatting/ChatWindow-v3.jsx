import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  Paper,
  Input,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import { VideoCall } from "@mui/icons-material";
import { getChatWithUser } from "~/services/chatServices/chatService";
import IsUserActive from "~/components/Elements/IsUserActive";

export default function MUIChatWindow({ onClose, friend }) {
  const messageBoxRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const prevScrollHeightRef = useRef(0);
  const messagesContainerRef = useRef(null);

  //add
  const [page, setPage] = useState(0);
  // const fetchOlderMessages = async () => {
  //   setLoading(true);
  //   await new Promise((resolve) => setTimeout(resolve, 600)); // fake delay

  //   const older = Array.from({ length: 10 }, (_, i) => ({
  //     id: `${Date.now()}-${i}`,
  //     sender: {
  //       name: `Người dùng ${Math.floor(Math.random() * 1000)}`,
  //       avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
  //       isOnline: Math.random() > 0.5,
  //     },
  //     content: `Tin nhắn nội dung #${Math.floor(Math.random() * 1000)}`,
  //     time: new Date().toLocaleTimeString(),
  //   }));

  //   setMessages((prev) => [...older, ...prev]);
  //   if (messages.length > 50) setHasMore(false);
  //   setLoading(false);
  // };
  const fetchChatList = async () => {
    setLoading(true);
    try {
      const data = await getChatWithUser(friend?._id, page);
      setMessages(data.reverse());
      scrollToBottom();
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };
  const handleScroll = () => {
    const nextPage = page + 1;
    const container = messageBoxRef.current;
    if (container.scrollTop === 0 && hasMore && !loading) {
      prevScrollHeightRef.current = container.scrollHeight;
      fetchChatList();
      setPage(nextPage);
    }
  };

  useLayoutEffect(() => {
    if (loading) {
      const container = messageBoxRef.current;
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - prevScrollHeightRef.current;
    }
  }, [messages]);

  useEffect(() => {
    fetchChatList();
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{ width: "100%", height: "500px", overflowY: "auto" }}
      ref={messageBoxRef}
      onScroll={handleScroll}
    >
      <Box sx={{ p: 2 }}>
        {loading && (
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        <Box
          component={Paper}
          elevation={6}
          sx={{
            position: "fixed",
            right: 50,
            bottom: 20,
            width: 420,
            maxHeight: 550,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            boxShadow: "0px 5px 18px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            flex: 1,
            overflowY: "auto",
            padding: 2,
            backgroundColor: "#f0f2f5",
            scrollBehavior: "smooth",
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
              backgroundColor: "#f8f9fa",
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar
                src={friend?.avatar}
                alt="User Avatar"
                sx={{ width: 45, height: 45, marginRight: 1.5 }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#333" }}
                >
                  {friend?.username}
                </Typography>
                <IsUserActive userId={friend?.email} />
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              {/* call button */}
              <IconButton
                onClick={() => {
                  alert(friendSocketId);
                  setName(currentUserInfo?.username || "none");
                  setIsCalling(() => true);
                  callUser(friendSocketId);
                }}
                disabled={!friend?._id}
                sx={{ color: "#1a97f2" }}
              >
                <VideoCall fontSize="large" />
              </IconButton>
              <IconButton onClick={onClose}>
                <CloseIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Section */}
          <Box
            onScroll={handleScroll}
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: 2,
              backgroundColor: "#f0f2f5",
              scrollBehavior: "smooth",
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.senderId === currentUserInfo?._id
                      ? "flex-end"
                      : "flex-start",
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "75%",
                    padding: 1.5,
                    borderRadius: "18px",
                    backgroundColor:
                      message.senderId === currentUserInfo?._id
                        ? "#0866ff"
                        : "#e4e6eb",
                    color:
                      message.senderId === currentUserInfo?._id
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
                      opacity: 0.6,
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
            <Input
              fullWidth
              placeholder="Nhập tin nhắn..."
              // value={newMessage}
              // onChange={(e) => setNewMessage(e.target.value)}
              inputRef={newMessage}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              size="small"
              variant="outlined"
              sx={{
                marginRight: 1,
                borderRadius: "20px",
                backgroundColor: "#f8f9fa",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              sx={{
                borderRadius: "50%",
                minWidth: "auto",
                padding: "10px",
                backgroundColor: "#1877f2",
                "&:hover": { backgroundColor: "#166fe5" },
              }}
            >
              <SendIcon fontSize="medium" />
            </Button>
          </Box>

          {/* <IncomingCall /> */}
        </Box>
      </Box>
    </Paper>
  );
}
