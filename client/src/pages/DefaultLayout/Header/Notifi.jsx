import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Slide,
  IconButton,
  useTheme,
  Menu,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getNotifi, readNotifi } from "~/services/notifiServices/notifiService";

const NotificationPanel = ({ open, close }) => {
  const [notifilist, setNotifiList] = useState([]);
  const theme = useTheme(); // Lấy theme hiện tại từ context MUI
  // useEffect(async () => {
  //   const data = await getNotifi();
  //   setNotifiList(data.json());
  //   return () => {
  //     console.log("cleanup");
  //   };
  // }, []);
  const handleReadNotifi = async (id) => {
    await readNotifi(id);
  };
  // if (!open) return;
  return (
    <Menu open={open} onClose={close}>
      <Slide
        direction="left"
        in={open}

        //   onClose={close}
      >
        <Box
          onClickAway={close}
          // ref={panelRef}
          sx={{
            position: "fixed",
            top: 100,
            right: 16,
            width: 300,
            maxHeight: "80vh",
            overflowY: "auto",
            zIndex: 11,
            backgroundColor: theme.palette.background.paper, // Sử dụng màu nền từ theme
            borderRadius: 2,
            boxShadow: 6,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mr: 15,
                fontSize: 24,
              }}
            >
              Notification
            </Typography>
            <IconButton onClick={close} size="small" color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>

          {notifilist.length > 0 ? (
            notifilist.map((notification, index) => (
              <Paper
                key={index}
                sx={{
                  m: 2,

                  p: 2,
                  // borderLeft: `4px solid ${getBorderColor(notification.type, theme)}`, // Dynamic border color
                  backgroundColor: notification?.isRead
                    ? theme.palette.background.paper
                    : theme.palette.info.light,
                  boxShadow: 3,
                  "&:hover": { boxShadow: 6 },
                  cursor: "pointer",
                }}
                onClick={() => handleReadNotifi(notification?._id)}
              >
                <Typography variant="body1" fontWeight="bold" sx={{ ml: 3 }}>
                  {notification.type}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ pl: 2 }}
                >
                  {notification.message +
                    " " +
                    new Date(notification.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" sx={{ p: 2, textAlign: "start" }}>
              <Divider sx={{ mb: 2 }} />
              No notifications
            </Typography>
          )}
        </Box>
      </Slide>
    </Menu>
  );
};

// Hàm xác định màu sắc dựa trên type và theme
const getBorderColor = (type, theme) => {
  switch (type) {
    case "new_message":
      return theme.palette.success.light; // Xanh nhạt
    case "new_post":
      return theme.palette.warning.light; // Vàng nhạt// Đỏ từ theme
    case "warning":
      return theme.palette.warning.main; // Cam từ theme
    default:
      return theme.palette.info.main; // Xanh dương mặc định từ theme
  }
};

export default NotificationPanel;
