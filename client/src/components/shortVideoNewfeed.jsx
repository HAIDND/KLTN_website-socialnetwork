import { useState } from "react";
import { IconButton, Box, Typography } from "@mui/material";
import { Favorite, ChatBubbleOutline, Share } from "@mui/icons-material";
import { useSwipeable } from "react-swipeable";

const videos = [
  { id: 1, src: "https://www.w3schools.com/html/mov_bbb.mp4", likes: 120, comments: 45 },
  { id: 2, src: "https://www.w3schools.com/html/movie.mp4", likes: 200, comments: 60 },
  { id: 3, src: "https://www.w3schools.com/html/mov_bbb.mp4", likes: 320, comments: 75 },
];

const Reels = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedUp: () => setCurrentIndex((prev) => (prev < videos.length - 1 ? prev + 1 : prev)),
    onSwipedDown: () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev)),
    trackMouse: true,
  });

  return (
    <Box
      {...handlers}
      sx={{
        width: "25vw",
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {videos.map((video, index) => (
        <Box
          key={video.id}
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <video
            src={video.src}
            autoPlay
            loop
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: 20,
              color: "white",
            }}
          >
            <Typography variant="h6">@User{video.id}</Typography>
            <Typography variant="body2">#hashtag #reels</Typography>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              right: 20,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <IconButton sx={{ color: "white" }}>
              <Favorite /> <Typography variant="body2">{video.likes}</Typography>
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <ChatBubbleOutline /> <Typography variant="body2">{video.comments}</Typography>
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <Share />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Reels;
