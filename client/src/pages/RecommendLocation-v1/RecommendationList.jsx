import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  TextField,
  Box,
  Grid,
} from "@mui/material";
import { ThumbUp, ThumbDown, ChatBubbleOutline } from "@mui/icons-material";
import { useRecommend } from "./RecommendContext";

const RecommendationList = () => {
  const { recommendations } = useRecommend();
  return (
    <Grid container spacing={2}>
      {recommendations.length > 0 &&
        recommendations.map((place, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <PlaceCard place={place} />
          </Grid>
        ))}
    </Grid>
  );
};

const PlaceCard = ({ place }) => {
  const [likes, setLikes] = useState(0);
  const [unlikes, setUnlikes] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleLike = () => setLikes(likes + 1);
  const handleUnlike = () => setUnlikes(unlikes + 1);
  const handleComment = (e) => {
    if (e.key === "Enter" && comment.trim() !== "") {
      setComments([...comments, comment]);
      setComment("");
    }
  };

  const rating =
    typeof place["Đánh giá"] === "string"
      ? place["Đánh giá"].replace("/5", "")
      : place["Đánh giá"];

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={place["Ảnh"]}
        alt={place["Tên địa điểm"]}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {place["Tên địa điểm"]}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {place["Mô tả"]}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          Đánh giá: ⭐ {rating}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={handleLike}>
          <ThumbUp />
        </IconButton>
        <Typography>{likes}</Typography>
        <IconButton onClick={handleUnlike}>
          <ThumbDown />
        </IconButton>
        <Typography>{unlikes}</Typography>
      </CardActions>
      <Box px={2} pb={2}>
        <TextField
          label="Bình luận..."
          variant="outlined"
          size="small"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleComment}
        />
        {comments.map((cmt, i) => (
          <Typography key={i} variant="body2" sx={{ mt: 1 }}>
            💬 {cmt}
          </Typography>
        ))}
      </Box>
    </Card>
  );
};

export default RecommendationList;
