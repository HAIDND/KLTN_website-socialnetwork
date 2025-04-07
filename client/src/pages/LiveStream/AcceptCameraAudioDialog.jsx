import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { VideoCallContext } from "~/context/VideoCallContext";

const AcceptCameraAudioDialog = ({ open, onClose }) => {
  const { getUserMediaStream } = useContext(VideoCallContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    getUserMediaStream(true);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Start Live Stream</DialogTitle>
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

export default AcceptCameraAudioDialog;
