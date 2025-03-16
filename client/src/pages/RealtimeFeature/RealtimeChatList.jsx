import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getChatList } from "~/services/chatServices/chatService";
import { getListFriend } from "~/services/friendServices/friendService";

const ChatListContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  right: 0,
  top: 0,
  width: 320,
  height: "90vh",
  background: `linear-gradient(145deg, ${theme.palette.background.default}, ${theme.palette.grey[300]})`,
  boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
  borderRadius: "16px 0 0 16px",
  overflowY: "auto",
  zIndex: 1300,
  padding: theme.spacing(2),
  marginTop: theme.spacing(10),
  marginRight: theme.spacing(2),
}));

const RealtimeChatList = ({ onClickReceiver }) => {
  const [chats, setChats] = useState([]);
  const [listFriend, setListFriend] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [chatFriend, setChatFriend] = useState(null);

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const [chatData, friendData] = await Promise.all([
          getChatList(),
          getListFriend(),
        ]);
        setChats(chatData);
        setListFriend(friendData);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };
    fetchChatList();
  }, []);

  const handleOpenChat = useCallback((chat) => {
    setChatFriend(chat);
    setOpenChat(true);
  }, []);

  const handleCloseChat = useCallback(() => {
    setOpenChat(false);
  }, []);

  return (
    <ChatListContainer>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        Chat List
      </Typography>

      <List sx={{ paddingTop: 2 }}>
        {chats.map((chat) => (
          <ListItem
            key={chat._id}
            sx={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#f0f2f5", cursor: "pointer" },
            }}
            alignItems="flex-start"
            onClick={() => onClickReceiver(chat)}
          >
            <ListItemAvatar>
              <Avatar alt={chat.name} src={chat.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={chat?.username}
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  noWrap
                >
                  {chat?.email}
                </Typography>
              }
            />
            {chat.hasNewMessage && (
              <Badge color="error" variant="dot" sx={{ marginLeft: "auto" }} />
            )}
          </ListItem>
        ))}
      </List>

      {/* {openChat && <ChatWindow friend={chatFriend} onClose={handleCloseChat} />} */}
    </ChatListContainer>
  );
};

export default RealtimeChatList;
