import React, { useContext, useEffect, useState } from "react";
import { Rating, TextField, Button, Box, Typography } from "@mui/material";
import { getMyRatingInLocations, postRatingLocation } from "./RecommendService";
import { CurrentUser } from "~/context/GlobalContext";
import { useRecommend } from "./RecommendContext";

const RatingLocation = ({ onSubmit, currentPlace }) => {
  const { state, dispatch } = useRecommend();
  const { currentUserInfo } = useContext(CurrentUser);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [idRated, setIsRated] = useState(false);
  //get my rating
  async function getMyRating() {}
  //trigger state
  useEffect(() => {
    dispatch({ type: "recommend/loading" });
    async function getMyRating() {
      const res = await getMyRatingInLocations(state.currentPlace._id);
      dispatch({
        type: "recommend/getMyRatingInLocation",
        payload: res.data,
      });
      if (res.data) {
        console.log("res rating", res.data);
        setStars(res.data.rating);
        setComment(res.data.comment);
        setIsRated(true);
      } else {
        setStars(0);
        setComment("");
        setIsRated(false);
      }
    }
    getMyRating();
  }, [state.currentPlace]);

  const handleSubmit = async () => {
    dispatch({ type: "recommend/loading" });
    if (stars > 0) {
      await postRatingLocation({
        userId: currentUserInfo._id,
        userName: currentUserInfo.username,
        userAvatar: currentUserInfo.avatar,
        userEmail: currentUserInfo.email,
        locationId: state.currentPlace._id,
        locationName: state.currentPlace.name,
        rating: stars,
        comment: comment,
      }).then((data) => {
        if (data) {
          console.log("effect mouted data loca");
          dispatch({
            type: "recommend/getMyRatingInLocation",
            payload: data.rating,
          });
        } else {
          console.log("No list friend");
        }
      });
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", marginTop: 2 }}
        >
          Your rating
        </Typography>
        <Rating
          name="location-rating"
          value={stars}
          onChange={(event, newValue) => setStars(newValue)}
          precision={1}
        />

        <TextField
          label="Commnent"
          multiline
          minRows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
        />

        <Button
          variant="contained"
          color={stars > 0 ? "primary" : "#ccc"}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          disabled={stars === 0}
        >
          {idRated ? "Update comment" : "Submit comment"}
        </Button>
      </Box>
    </>
  );
};

export default RatingLocation;
