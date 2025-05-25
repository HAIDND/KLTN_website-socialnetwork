import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Paper,
} from "@mui/material";
import { getChatWithUser } from "~/services/chatServices/chatService";

export default function MUIChatWindow({ onClose, friend }) {
  const messageBoxRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const prevScrollHeightRef = useRef(0);
  //add
  const [page, setPage] = useState(0);

  const fetchChatList = async () => {
    setLoading(true);
    try {
      const data = await getChatWithUser(friend?._id, page);
      // setMessages(data.reverse());
      if (data.length === 0) {
        setHasMore(false);
        setMessages((prev) => [
          {
            _id: "6830a30031a6a276885bssa833",
            senderId: "67daf228bdcb20f28067aa81",
            receiverId: "67cfb98a3152742c360ebba6",
            content: "Dỏn't have more",
            createdAt: "10 hours ago",
            __v: 0,
          },
          ...prev,
        ]);
      }
      data.reverse();
      setMessages((prev) => [...data, ...prev]);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchOlderMessages = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600)); // fake delay
    await fetchChatList();
    setPage(1);
    setLoading(false);
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
      console.log(messages);
    }
  }, [messages]);

  useEffect(() => {
    fetchOlderMessages();
    // fetchChatList();
    // setPage(1);
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

        <Stack spacing={2}>
          {messages.map((msg) => (
            <Stack
              direction="row"
              spacing={1}
              alignItems="flex-start"
              key={msg?._id}
            >
              <Avatar src={msg.sender?.avatar} alt={"msg.sender.receiverId"} />
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    {msg.senderId}
                  </Typography>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: msg?.sender?.isOnline ? "green" : "gray",
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {msg.createdAt}
                  </Typography>
                </Stack>
                <Typography variant="body2">{msg.content}</Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
