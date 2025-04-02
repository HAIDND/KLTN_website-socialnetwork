import { createContext, useState } from "react";
import GlobalTheme from "./GlobalTheme";
import { createTheme, useMediaQuery } from "@mui/material";
import { SocketProvider } from "~/context/SocketContext";
import { VideoCallProvider } from "~/context/VideoCallContext";

export const CurrentUser = createContext();
export default function GlobalContext({ children }) {
  //info current user
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  // Theme settings
  const [primaryColor, setPrimaryColor] = useState(
    sessionStorage.getItem("primaryColor") || "#2f3f"
  );
  const [secondaryColor, setSecondaryColor] = useState(
    sessionStorage.getItem("secondaryColor") || "#FFB347"
  );
  const [darkMode, setDarkMode] = useState(
    sessionStorage.getItem("darkMode") === "true"
  );
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: primaryColor },
      secondary: { main: secondaryColor },
    },
  });
  //info device
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Xác định kích thước màn hình mobile
  return (
    <CurrentUser.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentUserInfo,
        setCurrentUserInfo,
        primaryColor,
        secondaryColor,
        darkMode,
        setPrimaryColor,
        setSecondaryColor,
        setDarkMode,
        isMobile,
      }}
    >
      <SocketProvider userId={currentUserInfo?.userId}>
        {" "}
        <VideoCallProvider>
          <GlobalTheme theme={theme}>{children}</GlobalTheme>
        </VideoCallProvider>
      </SocketProvider>
    </CurrentUser.Provider>
  );
}
