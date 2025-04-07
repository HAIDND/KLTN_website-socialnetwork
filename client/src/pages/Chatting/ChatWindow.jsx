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
import {
  getChatWithUser,
  sendMessage,
} from "~/services/chatServices/chatService";
import { CurrentUser } from "~/routes/GlobalContext";
import { VideoCall } from "@mui/icons-material";
import CallVideos from "./CallVideos";
import notificationSound from "~/assets/RingNotifi/notifymoe.mp3"; // Import the notification sound
import { SocketContext } from "~/context/SocketContext";
import IsUserActive from "~/components/Elements/IsUserActive";
import { VideoCallContext } from "~/context/VideoCallContext";
import Videocall from "~/components/VideoChat";
import zIndex from "@mui/material/styles/zIndex";
import IncomingCall from "./IncomingCall/IncomingCall";
import Video from "./Video/Video";
const ChatWindow = ({ onClose, friend }) => {
  const { setHaveNewMess, haveNewMess, socket } = useContext(SocketContext);

  const { currentUserInfo } = useContext(CurrentUser);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ifCall, setIfCall] = useState(false);
  const messagesEndRef = useRef(null);
  //handle set info call video name = name user, myusserid = usersocketid
  const {
    setName,
    setIsCalling,
    callUser,
    isCallAccepted,
    getUserMediaStream,
  } = useContext(VideoCallContext);
  const [friendSocketId, setFriendSocketId] = useState(null);
  // Gửi friendId lên server để lấy socketId của bạn bè
  const getFriendSocketId = () => {
    socket.emit("useridtosocketid", friend?.email, (socketId) => {
      setFriendSocketId(socketId);
      console.log(`Socket ID của ${friend?.email}: ${socketId}`);
    });
  };
  useEffect(() => {
    getFriendSocketId();
  }, []);

  const handleSetCall = () => {
    if (!friend?.email) {
      console.error("Friend's socket ID is not available");
      return;
    }
    try {
      alert(friendSocketId);

      setName(currentUserInfo?.username || "none");
      callUser(friendSocketId); // Use friend's socket ID instead of hardcoded value
    } catch (error) {
      console.error("Failed to initiate call:", error);
    }
  };

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const data = await getChatWithUser(friend?._id);
        setMessages(data);
        scrollToBottom();
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };
    console.log("friend", friend);

    // socket.emit("register", currentUserInfo?._id);
    fetchChatList();
  }, []);
  //send messs
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(friend?._id, newMessage);
    socket.emit("private_message", {
      senderId: currentUserInfo?.email,
      receiverId: friend?.email,
      message: newMessage,
    });
    setMessages((messages) => [
      ...messages,
      {
        content: newMessage,
        createdAt: new Date().toISOString(),
        senderId: currentUserInfo._id,
        // senderId: senderId,
      },
    ]);
    setNewMessage("");

    // await sendMessage(friend?._id, newMessage);
    // setNewMessage("");
    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   {
    //     senderId: currentUserInfo?._id,
    //     content: newMessage,
    //     createdAt: new Date().toISOString(),
    //   },
    // ]);
    scrollToBottom();
  };
  // Nhận tin nhắn riêng tư
  // useEffect(() => {
  //   socket.on("private_message", ({ senderId, message }) => {
  //     setMessages((messages) => [
  //       ...messages,
  //       {
  //         content: message,
  //         createdAt: " hours ago",
  //         receiverId: currentUserInfo._id,
  //         senderId: senderId,
  //         __v: 0,
  //         _id: "67d19813ec360214c557ec83",
  //       },
  //     ]);
  //     console.log(message);
  //     audio.play();
  //   });
  //   return () => {
  //     socket.off("private_message", ({ senderId, message }) => {
  //       setMessages((messages) => [
  //         ...messages,
  //         {
  //           content: message,
  //           createdAt: " hours ago",
  //           receiverId: currentUserInfo._id,
  //           senderId: senderId,
  //           __v: 0,
  //           _id: "67d19813ec360214c557ec83",
  //         },
  //       ]);
  //       console.log(message);
  //       audio.play();
  //     }); // Cleanup listener khi component unmount
  //   };
  // }, [socket]);
  ///fix setmess 2 time
  useEffect(() => {
    const handlePrivateMessage = ({ senderId, message }) => {
      setMessages((messages) => [
        ...messages,
        {
          content: message,
          createdAt: new Date().toISOString(),
          receiverId: currentUserInfo._id,
          senderId: senderId,
        },
      ]);
      console.log(message);
      setHaveNewMess(() => !haveNewMess);
    };

    socket.on("private_message", handlePrivateMessage);

    return () => {
      socket.off("private_message", handlePrivateMessage); // Xóa listener đúng cách
    };
  }, []); // Chỉ chạy lại khi socket thay đổi
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {!isCallAccepted && (
        <>
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
              <TextField
                fullWidth
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
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
        </>
      )}
    </>
  );
};

export default ChatWindow;
