import React, { useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { Box, Button, Grid, Input } from "@mui/material";
import { LogoDev } from "@mui/icons-material";
import { CurentUser } from "~/MainRoutes";
import { SocketContext } from "~/context/SocketContext";

function ChatFriend() {
  const socket = useContext(SocketContext);
  const { contextValue, curentUserProfile } = useContext(CurentUser);
  console.log(curentUserProfile);
  const [userID, setUserID] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [listMessage, setListMessage] = useState([]);
  const [listUser, setListUser] = useState([]);
  function sendMessage(message) {
    socket.emit("message", message);
    socket.emit("private_message", { senderId: userID, receiverId, message });
    setMessage("");
  }
  socket.on(
    "message",
    (mess) => (setListMessage([...listMessage, mess]), console.log(mess))
  );
  // Nhận tin nhắn riêng tư
  socket.on("private_message", ({ senderId, message }) => {
    setListMessage(() => [...listMessage, message]);
  });

  socket.on("connection", (user) => setListUser([...listUser, user]));

  socket.emit("register", userID);
  useEffect(
    () =>
      //   socket.on("message", (message) =>
      // setListMessage([...listMessage, message]), console.log(listMessage)
      console.log(1),
    [listMessage, userID]
  );
  return (
    <Box sx={{ padding: 5, position: "relative", marginTop: 10 }}>
      <LogoDev fontSize="45px"></LogoDev>
      <Grid container>
        <Grid item xs={12} sm={4}>
          list user
          <ul>
            {listUser.length > 0 &&
              listUser.map((user) => <li key={user}>{user}</li>)}
          </ul>
        </Grid>
        <Grid item xs={12} sm={4}>
          ChatBox
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
        <Grid item xs={12} sm={4}>
          <Box>
            <div>setting id</div>{" "}
            <Input
              placeholder="id user"
              type="text"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
            />
            <Input
              placeholder="id setReceiverId"
              type="text"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
            />
            {/* <button>Setting</button> */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChatFriend;
