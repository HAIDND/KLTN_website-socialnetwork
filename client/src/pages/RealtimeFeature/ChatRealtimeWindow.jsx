import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Grid, Input } from "@mui/material";

import {
  getChatWithUser,
  sendMessage,
} from "~/services/chatServices/chatService";
import { CurrentUser } from "~/routes/GlobalContext";
import io from "socket.io-client";
import notificationSound from "~/assets/RingNotifi/notifymoe.mp3";
// Import the notification sound notification18.mp3

// const socket = io(`http://localhost:5000`);
const ChatRealtimeWindow = ({ receiver }) => {
  return <ChatFriends receiver={receiver} />;
};

export default ChatRealtimeWindow;

function ChatFriends({ receiver }) {
  const audio = new Audio(notificationSound);
  //curetn ueer
  const { currentUserInfo } = useContext(CurrentUser);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [listMessage, setListMessage] = useState([]);

  function sendMessage(message) {
    socket.emit("message", message);
    socket.emit("private_message", {
      senderId: currentUserInfo?._id,
      receiverId: receiver?._id,
      message,
    });
    setMessage("");
  }
  socket.on(
    "message",
    (mess) => (setListMessage([...listMessage, mess]), console.log(mess))
  );
  // Nhận tin nhắn riêng tư
  socket.on("private_message", ({ senderId, message }) => {
    setListMessage(() => [...listMessage, message]);
    console.log("notification");
    // audio.play();
  });
  socket.on("connection", (user) => setListUser([...listUser, user]));
  socket.emit("register", currentUserInfo?._id);
  return (
    <Box>
      <Grid container>
        <Grid item xs={12} sm={4}>
          ChatBox with {receiver != null ? receiver?._id : "receiver"}
          {listMessage &&
            listMessage.map((message) => <div key={message}>{message}</div>)}
          <Input
            type="text"
            placeholder="Type your message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            onKeyPress={(e) => e.key === "Enter" && sendMessage(message)}
          />
          <Button onClick={() => sendMessage(message)}>Send</Button>
        </Grid>
        <Grid item xs={12} sm={4}></Grid>
      </Grid>
    </Box>
  );
}
