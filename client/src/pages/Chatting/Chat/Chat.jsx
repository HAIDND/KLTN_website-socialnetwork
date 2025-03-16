import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Send as SendIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import notification from "~/assets/notification.mp3";

const ChatModal = ({
  isVisible,
  toggleModal,
  chatMessages,
  sendMessage,
  setSendMessage,
  onSearch,
  receivedMessage,
}) => {
  const messagesEndRef = useRef(null);
  const notificationSound = useRef(null);
  const [showNotification, setShowNotification] = useState(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (isVisible) {
      scrollToBottom();
    }

    if (receivedMessage.text && !isVisible) {
      if (notificationSound.current) {
        notificationSound.current.play();
      }
      setShowNotification(true);
    }
  }, [receivedMessage, isVisible]);

  const handleSend = () => {
    if (sendMessage.trim()) {
      onSearch(sendMessage);
      setSendMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <audio src={notification} ref={notificationSound} />
      <Snackbar
        open={showNotification}
        autoHideDuration={3000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          icon={<MessageIcon />}
          severity="info"
          onClose={() => setShowNotification(false)}
        >
          {receivedMessage.text}
        </Alert>
      </Snackbar>

      <Dialog
        open={isVisible}
        onClose={() => toggleModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: "60vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Typography variant="h6">Chat</Typography>
          <IconButton
            onClick={() => toggleModal(false)}
            size="small"
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            flex: 1,
            overflow: "auto",
            p: 2,
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
            },
          }}
        >
          {chatMessages.length ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {chatMessages.map((message, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 1,
                    maxWidth: "70%",
                    alignSelf:
                      message.type === "sent" ? "flex-end" : "flex-start",
                    bgcolor:
                      message.type === "sent"
                        ? "primary.main"
                        : "background.paper",
                    color: message.type === "sent" ? "white" : "text.primary",
                  }}
                >
                  <Typography variant="body1">{message.message}</Typography>
                </Paper>
              ))}
              <div ref={messagesEndRef} />
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No messages here
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", width: "100%", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Send a message"
              value={sendMessage}
              onChange={(e) => setSendMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
            />
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon />
            </IconButton>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatModal;
