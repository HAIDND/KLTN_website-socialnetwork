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
  Rating,
} from "@mui/material";
import { ThumbUp, ThumbDown, ChatBubbleOutline } from "@mui/icons-material";
import { useRecommend } from "./RecommendContext";
import { getRecommend } from "~/api/RecommendAPI";

const RecommendationList = () => {
  const { state, dispatch } = useRecommend();
  console.log("state", state);

  return (
    <Grid container spacing={2}>
      <CurrentPlace />
      {state.listRecommend?.length > 0 &&
        state.listRecommend.map((place, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <PlaceCard place={place} />
          </Grid>
        ))}
    </Grid>
  );
};
function CurrentPlace() {
  const { state } = useRecommend();
  if (!state.currentPlace) return <></>;
  const rating =
    typeof state.currentPlace.rating === "string"
      ? state.currentPlace.rating.replace("/5", "")
      : state.currentPlace.rating;
  return (
    <>
      <Card sx={{ width: "100%", m: 2, borderRadius: 3, boxShadow: 4 }}>
        <CardMedia
          component="img"
          height="400"
          image={state.currentPlace.image_url}
          alt={state.currentPlace.name}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {state.currentPlace.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {state.currentPlace.description}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Địa điểm: {state.currentPlace.name}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              <Rating
                name="read-only"
                value={rating}
                precision={0.1}
                readOnly
                size="small"
              />
              {rating}
            </Typography>

            {/* <span variant="subtitle2" color="text.secondary">
              {state.currentPlace.rating}
            </span> */}
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
const PlaceCard = ({ place }) => {
  const [likes, setLikes] = useState(0);
  const [unlikes, setUnlikes] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const { state, dispatch } = useRecommend();
  const handleLike = () => setLikes(likes + 1);
  const handleUnlike = () => setUnlikes(unlikes + 1);
  const handleComment = (e) => {
    if (e.key === "Enter" && comment.trim() !== "") {
      setComments([...comments, comment]);
      setComment("");
    }
  };

  const rating =
    typeof place.rating === "string"
      ? place.rating.replace("/5", "")
      : place.rating;
  const handleClick = async (place) => {
    const data = await getRecommend(place.id);
    dispatch({
      type: "recommend/clickLocation",
      payload: { place, data: data.recommendations },
    });
  };
  return (
    <Card
      onClick={() => handleClick(place)}
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
        image={place.image_url}
        alt={place.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {place.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {place.description}
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
