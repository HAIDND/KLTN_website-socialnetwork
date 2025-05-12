import { Avatar, Box, Typography, Rating, Paper, Grid } from "@mui/material";
import { getRatingInLocation } from "./RecommendService";
import { useRecommend } from "./RecommendContext";
import { useCallback, useEffect, useRef, useState } from "react";

export default function RatingInLocation() {
  const { state, dispatch } = useRecommend();
  const [currentRatingInLocation, setCurrentRatingInLocation] = useState();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchRatingInLocation = useCallback(async () => {
    const ratingData = await getRatingInLocation({
      locationId: state.currentPlace._id,
      page: page,
    });
    // if (ratingData) {
    //   setCurrentRatingInLocation(ratingData.data);
    //   setHasMore(ratingData.length > 0);
    // }
    if (ratingData) {
      setCurrentRatingInLocation((prev) => [
        ...(prev || []),
        ...ratingData.data,
      ]);
      dispatch({
        type: "recommend/getRatingInLocation",
        payload: ratingData.data,
      });
      setHasMore(ratingData.data.length > 0);
    } else {
      console.log("No rating data");
    }
  }, [page]);

  useEffect(() => {
    dispatch({ type: "recommend/loading" });
    fetchRatingInLocation();
  }, [fetchRatingInLocation, state.currentPlace.id]);

  const lastLocationRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );
  if (!state.currentlistRating || state.currentlistRating.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" mt={2}>
        No rating yet.
      </Typography>
    );
  }

  return (
    <Box
      mt={2}
      sx={{
        overflowY: "auto",
        border: "1px solid #ddd",
        p: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        User rating
      </Typography>
      <Grid container spacing={2}>
        {!state.currentlistRating ? (
          <Typography>No rating in this location</Typography>
        ) : (
          state.currentlistRating.map((r, index) => (
            <Grid
              item
              xs={12}
              key={index}
              ref={
                index === state.currentlistRating.length - 1
                  ? lastLocationRef
                  : null
              }
            >
              <Paper elevation={2} sx={{ p: 2, display: "flex", gap: 2 }}>
                <Avatar src={r.userAvatar} alt={r.userName} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {r.userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {r.userEmail}
                  </Typography>
                  <Rating
                    value={r.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                  <Typography variant="body2" mt={1}>
                    {r.comment}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
