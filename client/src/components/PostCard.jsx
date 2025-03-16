import React, { useState, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Grid,
  Popper,
  Paper,
  Fade,
  ClickAwayListener,
} from "@mui/material";
import {
  ThumbUp,
  Favorite,
  SentimentDissatisfied,
  InsertEmoticon,
  Mood,
  LocationOn,
  ChatBubbleOutline,
  Share,
} from "@mui/icons-material";
import Comments from "./Comments";

const reactions = [
  { label: "Like", icon: <ThumbUp />, color: "primary" },
  { label: "Love", icon: <Favorite />, color: "error" },
  { label: "Haha", icon: <InsertEmoticon />, color: "warning" },
  { label: "Wow", icon: <Mood />, color: "secondary" },
  { label: "Sad", icon: <SentimentDissatisfied />, color: "info" },
];

const post = {
  userAvatar: "https://i.pravatar.cc/150?img=5",
  userName: "Nguyễn Văn A",
  emotion: "😊 Hạnh phúc",
  location: "Hà Nội, Việt Nam",
  content: "Một ngày tuyệt vời cùng bạn bè!",
  images: [
    "https://source.unsplash.com/random/600x400?sig=1",
    "https://source.unsplash.com/random/600x400?sig=2",
  ],
};

const PostCard = () => {
  const [selectedReaction, setSelectedReaction] = useState(reactions[0]); // Mặc định Like
  const [showReactions, setShowReactions] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(null);
  const likeButtonRef = useRef(null); // Tham chiếu đến nút Like để định vị popup

  const handleReactionSelect = (reaction) => {
    setSelectedReaction(reaction);
    setShowReactions(false); // Ẩn popup sau khi chọn
  };

  const handleMouseEnter = () => {
    setHoverTimer(
      setTimeout(() => {
        setShowReactions(true);
      }, 200)
    );
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer);
    setShowReactions(false);
  };

  const [showComments, setShowComments] = useState(false);

  return (
    <Card sx={{ maxWidth: 600, mb: 3, borderRadius: 3, boxShadow: 3 }}>
      {/* Header */}
      <CardHeader
        avatar={<Avatar src={post.userAvatar} />}
        title={<Typography fontWeight="bold">{post.userName}</Typography>}
        subheader={
          <Typography variant="body2" color="text.secondary">
            {post.emotion && `${post.emotion} · `}
            {post.location && (
              <>
                <LocationOn fontSize="small" sx={{ verticalAlign: "middle" }} /> {post.location}
              </>
            )}
          </Typography>
        }
      />

      {/* Nội dung bài đăng */}
      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
      </CardContent>

      {/* Hiển thị ảnh */}
      {post.images.length > 0 && (
        <Grid container spacing={1} sx={{ p: 1 }}>
          {post.images.map((image, index) => (
            <Grid
              item
              xs={post.images.length === 1 ? 12 : 6}
              key={index}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                component="img"
                src={image}
                sx={{
                  width: "100%",
                  height: post.images.length === 1 ? 250 : 150,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Actions: Like, Comment, Share */}
      <CardActions sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
        {/* Like Button */}
        <Box position="relative">
          <ClickAwayListener onClickAway={() => setShowReactions(false)}>
            <Box>
              <IconButton
                ref={likeButtonRef}
                color={selectedReaction.color}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleReactionSelect(reactions[0])} // Click lại về Like
              >
                {selectedReaction.icon}
              </IconButton>

              {/* Popup các cảm xúc khác ngay trên nút Like */}
              <Popper
                open={showReactions}
                anchorEl={likeButtonRef.current}
                placement="top"
                transition
                sx={{ zIndex: 10 }}
                setTimeout={200}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={200}>
                    <Paper
                      sx={{
                        display: "flex",
                        p: 1,
                        borderRadius: 2,
                        boxShadow: 3,
                        backgroundColor: "background.paper",
                      }}
                    >
                      {reactions.map((reaction) => (
                        <IconButton
                          key={reaction.label}
                          color={reaction.color}
                          onClick={() => handleReactionSelect(reaction)}
                          sx={{ mx: 0.5 }}
                         
                        >
                          {reaction.icon}
                        </IconButton>
                      ))}
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </Box>
          </ClickAwayListener>
        </Box>

        {/* Comment & Share */}
        <Box>
          <Button onClick={() => setShowComments(!showComments)} startIcon={<ChatBubbleOutline />} color="inherit">
            Bình luận
          </Button>
          <Button startIcon={<Share />} color="inherit">
            Chia sẻ
          </Button>
        </Box>
      </CardActions>

      {/* Hiển thị Component Comments khi bấm nút Bình luận */}
      {showComments && <Comments postId={post.id} />}
    </Card>
  );
};

export default PostCard;
