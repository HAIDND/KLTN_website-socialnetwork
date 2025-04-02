import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

const StartStreamDialog = ({ open, onClose, onStart }) => {
  const [streamTitle, setStreamTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (streamTitle.trim()) {
      onStart(streamTitle);
      setStreamTitle("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Start Live Stream</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              fullWidth
              label="Stream Title"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!streamTitle.trim()}
          >
            Start Streaming
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StartStreamDialog;
