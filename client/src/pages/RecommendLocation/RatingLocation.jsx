import React, { useContext, useState } from "react";
import { Rating, TextField, Button, Box } from "@mui/material";
import { postRatingLocation } from "./RecommendService";
import { CurrentUser } from "~/context/GlobalContext";

const RatingLocation = ({ onSubmit, currentPlace }) => {
  const { currentUserInfo } = useContext(CurrentUser);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [currentRating, setCurrentRating] = useState();
  const handleSubmit = async () => {
    if (stars > 0) {
      await postRatingLocation({
        userId: currentUserInfo._id,
        userEmail: currentUserInfo.email,
        locationId: currentPlace._id,
        locationName: currentPlace.name,
        rating: stars,
        comment: comment,
      }).then((data) => {
        if (data) {
          console.log("effect mouted data loca");
        } else {
          console.log("No list friend");
        }
      });
      // onSubmit({ stars, comment });
      // Reset nếu muốn
      setCurrentRating([stars, comment]);
      setStars(0);
      setComment("");
    }
  };

  return (
    <Box
      sx={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Rating
        name="location-rating"
        value={stars}
        onChange={(event, newValue) => setStars(newValue)}
        precision={1}
      />

      <TextField
        label="Bình luận"
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
        Gửi đánh giá
      </Button>
    </Box>
  );
};

export default RatingLocation;
