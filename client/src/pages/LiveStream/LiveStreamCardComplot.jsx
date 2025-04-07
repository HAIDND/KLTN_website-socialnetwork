import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import { PersonOutline, AccessTime, PlayArrow } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { VideoCallContext } from "~/context/VideoCallContext";

const LiveStreamCard = ({ room }) => {
  const { startLiveStream, joinLiveStream } = useContext(VideoCallContext);
  const navigate = useNavigate();
  console.log("room", room);
  return (
    <Card
      sx={{
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
      onClick={() => navigate(`/livestream/${room.id}`)}
    >
      <CardMedia
        component="div"
        sx={{
          height: 200,
          bgcolor: "grey.300",
          position: "relative",
        }}
      >
        <Chip
          label="LIVE"
          color="error"
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
          }}
        />
        <IconButton
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          <PlayArrow sx={{ color: "white" }} />
        </IconButton>
      </CardMedia>

      <CardContent>
        <Typography variant="h6" noWrap>
          {room.streamer}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonOutline sx={{ fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2">
              {room.viewers.length} watching
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccessTime sx={{ fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2">
              {formatDistanceToNow(new Date(room.startTime))}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LiveStreamCard;
