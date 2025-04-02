import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "~/context/SocketContext";
export function CheckUserActive(userId) {
  const { socket } = useContext(SocketContext);
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    if (!userId || !socket) return;

    // Check initial online status
    socket.emit("checkUserOnline", userId);

    // Listen for online status updates
    const handleUserStatus = (status) => {
      setIsUserOnline(status);
    };

    // Listen for specific user's online status
    socket.on("checkUserOnline", handleUserStatus);

    // Listen for user connection/disconnection events
    socket.on("userConnected", (connectedUserId) => {
      if (connectedUserId === userId) {
        setIsUserOnline(true);
      }
    });

    socket.on("userDisconnected", (disconnectedUserId) => {
      if (disconnectedUserId === userId) {
        setIsUserOnline(false);
      }
    });

    // Cleanup listeners
    return () => {
      socket.off("checkUserOnline", handleUserStatus);
      socket.off("userConnected");
      socket.off("userDisconnected");
    };
  }, [socket, userId]);

  return isUserOnline;
}
function IsUserActive({ userId }) {
  const isUserOnline = CheckUserActive(userId);

  return (
    <Typography
      variant="body2"
      color="textSecondary"
      sx={{ display: "flex", alignItems: "center" }}
    >
      {isUserOnline ? (
        <>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "green",
              marginRight: 1,
            }}
          />
          Active now
        </>
      ) : (
        <>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "grey",
              marginRight: 1,
            }}
          />
          Offline
        </>
      )}
    </Typography>
  );
}

export default IsUserActive;
