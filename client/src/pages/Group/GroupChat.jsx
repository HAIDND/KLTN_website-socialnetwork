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
import { notifiSound } from "~/assets/RingNotifi/audioNotifi";
import { CurrentUser } from "~/context/GlobalContext";
import socket from "~/context/SocketInitial";
import { getGroupMessage, postGroupMessage } from "./groupChatService";

function GroupChat() {
  const chatRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { currentUserInfo } = useContext(CurrentUser);
  const topMessageRef = useRef(null);
  const observer = useRef();
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { id } = useParams();
  const [page, setPage] = useState(0); // Trang bắt đầu từ 0
  // Load ban đầu
  useEffect(() => {
    setPage(0);
    setMessages([]);
    setHasMore(true);

    const initLoad = async () => {
      const data = await getGroupMessage(id, page, 5);
      console.log("data", data);
      setMessages(Array.isArray(data) ? data : []);
      scrollToBottom(); // Scroll xuống tin mới nhất
    };
    initLoad();
  }, [id]);

  // Tải thêm khi scroll tới đầu
  useEffect(() => {
    if (loadingMore || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          setLoadingMore(true);

          const container = chatRef.current;
          const previousScrollHeight = container.scrollHeight;

          const nextPage = page + 1;
          const more = await getGroupMessage(id, nextPage);

          if (more.length === 0) {
            setHasMore(false);
          } else {
            setMessages((prev) => [...more, ...prev]);
            setPage(nextPage);

            // Giữ nguyên vị trí cuộn
            setTimeout(() => {
              const newScrollHeight = container.scrollHeight;
              container.scrollTop = newScrollHeight - previousScrollHeight;
            }, 100);
          }

          setLoadingMore(false);
        }
      },
      {
        root: chatRef.current,
        threshold: 0.1,
      }
    );

    if (topMessageRef.current) {
      observer.current.observe(topMessageRef.current);
    }
  }, [messages, page, hasMore, loadingMore]);

  // Scroll xuống cuối
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  };
  useEffect(() => {
    socket.emit("joinOrCreateGroupRoom", {
      groupId: id,
      memberId: currentUserInfo?.email,
    });

    // Nghe nhận tin nhắn realtime
    socket.on("groupChat", ({ groupId, message, senderName, senderId }) => {
      if (senderId !== currentUserInfo?.email) {
        notifiSound.play();
      }

      setMessages((prev) => [
        ...prev,
        { senderId, message, senderName, createAt: new Date().toDateString() },
      ]);
    });
    return () => {
      socket.off("groupChat");
      socket.emit("leaveRoom", {
        groupId: id,
        memberId: currentUserInfo?.email,
      });
    };
  }, []);

  //send messs
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    socket.emit("groupChat", {
      groupId: id,
      message: newMessage,
      senderId: currentUserInfo?.email,
      senderName: currentUserInfo?.username,
    });
    await postGroupMessage({
      senderAvatar: currentUserInfo?.avatar,
      groupId: id,
      message: newMessage,
      senderId: currentUserInfo?.email,
      senderName: currentUserInfo?.username,
    });
    setNewMessage("");
  };
  return (
    <div>
      <Paper
        sx={{
          width: 350,
          display: "flex",
          flexDirection: "column",
          borderLeft: 1,
          borderColor: "divider",
          height: "85vh",
          position: "fixed",
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
          {messages.length > 0 &&
            messages.map((msg, idx) => {
              const isOwnMessage = msg.senderId === currentUserInfo?.email;
              return (
                <Box
                  key={idx}
                  ref={idx === 0 ? topMessageRef : null} // Theo dõi tin đầu tiên
                  sx={{
                    display: "flex",
                    justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isOwnMessage ? "row-reverse" : "row",
                      alignItems: "flex-start",
                      gap: 1,
                      maxWidth: "80%",
                      padding: 1,
                      borderRadius: 2,
                      backgroundColor: isOwnMessage ? "#d1e7dd" : "#f0f0f0",
                      border: "1px solid #ccc",
                    }}
                  >
                    <Avatar
                      src={msg?.senderAvatar}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color={isOwnMessage ? "secondary" : "primary"}
                      >
                        {msg.senderName}
                      </Typography>
                      <Typography variant="body2">{msg.message}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(
                          msg.createdAt || Date.now()
                        ).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
        </Box>

        {/* Chat Input */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
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
