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
import { getRecommendContent } from "~/api/RecommendAPI";
import IsLoadingAction from "~/components/Elements/IsLoadingAction";
import RatingLocation from "./RatingLocation";
import CurrentPlace from "./CurrentPlace";

const RecommendationList = ({ lastLocationRef }) => {
  const { state } = useRecommend();
  return (
    <Grid container spacing={2} sx={{ border: "2px solid #ccc", p: 2 }}>
      <CurrentPlace />
      {state.listAllPlace?.length > 0 &&
        state.listAllPlace.map((place, index) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            key={index}
            ref={
              index === state.listAllPlace.length - 1 ? lastLocationRef : null
            }
          >
            <PlaceCard place={place} />
          </Grid>
        ))}
      {!state.isLoading && <IsLoadingAction />}
    </Grid>
  );
};

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
    // const data = await getRecommend(place.id);
    console.log("place", place.id);
    const data = await getRecommendContent(place.id);
    console.log("data", data.recommendations);
    dispatch({
      type: "recommend/clickLocation",
      payload: { current: place, recommendContent: data.recommendations },
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth", // hoặc "auto" nếu không cần mượt
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
        justifyContent: "space-between",
        border: "2px solid #ccc",
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={place.imageUrl}
        alt={place.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {place.name}
        </Typography>
        {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {place.description}
        </Typography> */}
        <Typography variant="body2" fontWeight="bold">
          Rating: ⭐ {rating}
        </Typography>
      </CardContent>
      {/* <RatingLocation currentPlace={place} /> */}
    </Card>
  );
};

export default RecommendationList;
