import React, { useState, useContext } from "react";
import { VideoCallContext } from "~/context/Context";
// import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import {
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  Call as CallIcon,
} from "@mui/icons-material";

const FormCard = () => {
  const [idToCall, setIdToCall] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { name, setName, myUserId, callUser, isCallAccepted } =
    useContext(VideoCallContext);

  const handleCopyClick = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <>
      {!isCallAccepted && (
        <Box sx={{ maxWidth: 400, margin: "0 auto", p: 2 }}>
          <Card elevation={3}>
            <CardContent>
              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  fullWidth
                  label="Your Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />

                {/* <CopyToClipboard text={myUserId}> */}
                <Button
                  variant="contained"
                  color={isCopied ? "success" : "primary"}
                  onClick={handleCopyClick}
                  startIcon={isCopied ? <CheckIcon /> : <ContentCopyIcon />}
                  sx={{ mb: 2 }}
                >
                  {isCopied ? "Copied!" : "Copy Your ID"}
                </Button>
                {/* </CopyToClipboard> */}

                <TextField
                  fullWidth
                  label="ID to Call"
                  variant="outlined"
                  value={idToCall}
                  onChange={(e) => setIdToCall(e.target.value)}
                  placeholder="Enter the ID to make a call"
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => callUser(idToCall)}
                  startIcon={<CallIcon />}
                  sx={{ mt: 1 }}
                >
                  Call
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
};

export default FormCard;
