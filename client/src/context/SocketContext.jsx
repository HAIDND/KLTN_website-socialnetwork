import { createContext, useContext, useEffect, useState } from "react";
import socket from "./socket"; // Import socket từ file trên
import { CurrentUser } from "~/routes/GlobalContext";
import { audio } from "~/assets/RingNotifi/audioNotifi";

export const SocketContext = createContext();

export const SocketProvider = ({ children, userId }) => {
  const { currentUserInfo } = useContext(CurrentUser);
  const [haveNewMess, setHaveNewMess] = useState(true);
  useEffect(() => {
    if (currentUserInfo) {
      //   socket.connect();
      //   socket.emit("userConnected", userId); // Gửi userId lên server
      //   socket.emit("register", currentUserInfo?._id);
      // socket.connect();
      // socket.emit("register", currentUserInfo._id);
      console.log("login");
      return () => {
        // socket.disconnect();
        socket.off("register"); // Gỡ sự kiện khi component unmount
      };
    }
  }, [userId]);
  //efectnotifi mess
  useEffect(() => {
    const handleListenMessage = ({ senderId, message }) => {
      console.log("new mess is " + message);
      audio.play();
    };
    socket.on("private_message", handleListenMessage);
    return () => {
      socket.off("private_message");
    };
    // audio.play();
    // { senderId, message }) => {
    //   console.log("Tin nhắn mới:", message);
    //   // Tăng số tin nhắn chưa đọc
    //   // setUnreadMessages((prev) => prev + 1);
    //   // Phát âm thanh thông báo
    //   audio.play();
    // }
    // console.log(haveNewMess);
  }, [haveNewMess]);
  return (
    <SocketContext.Provider value={{ socket, setHaveNewMess, haveNewMess }}>
      {children}
    </SocketContext.Provider>
  );
};
