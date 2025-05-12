import { Grid } from "@mui/material";
import RecommendSearch from "./RecommendSearch";
import RecommendationList from "./RecommendationList";
import { getAllLocations, postForGetRecommend } from "./RecommendService";
import { useCallback, useEffect, useRef, useState } from "react";
import { RecommendContext, useRecommend } from "./RecommendContext";
import IsLoadingAction from "~/components/Elements/IsLoadingAction";
function RecommendPage() {
  const { state, dispatch } = useRecommend();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchLocations = useCallback(() => {
    try {
      dispatch({ type: "recommend/loading" });
      getAllLocations(page).then((data) => {
        if (data) {
          console.log("effect mouted data loca");
          dispatch({ type: "recommend/getMore", payload: data });
        } else {
          console.log("No list friend");
        }
      });
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  }, [page]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

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
  return (
    <Grid container>
      <Grid
        item
        flex={2}
        sx={{ overflow: "auto" }}
        display={{ xs: "none", md: "block", lg: "block" }}
      ></Grid>
      <Grid item flex={5} sx={{ mt: 12, height: "100%", overflow: "auto" }}>
        <IsLoadingAction isLoading={state.isLoading} />
        {/* <RecommendSearch /> */}
        <RecommendationList lastLocationRef={lastLocationRef} />
      </Grid>
    </Grid>
  );
}
export default RecommendPage;
