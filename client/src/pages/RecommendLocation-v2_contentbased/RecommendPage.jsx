import { Grid } from "@mui/material";
import RecommendSearch from "./RecommendSearch";
import RecommendationList from "./RecommendationList";
import { postForGetRecommend } from "./RecommendService";
import { useEffect, useState } from "react";
import { RecommendContext, useRecommend } from "./RecommendContext";
import { getRecommend } from "~/utils/RecommendAPI";

// const recommendations = [
//   {
//     "Mô tả":
//       "Công viên giải trí Vinpearl Hậu Giang là khu vui chơi giải trí hiện đại...",
//     "Tên địa điểm": "Công viên giải trí Vinpearl Hậu Giang",
//     "Đánh giá": 4.3,
//     Ảnh: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKcf2MdvR1tzFaSudJbTNbCmNy5Jxo-qQoIw&s",
//   },
//   {
//     "Mô tả":
//       "Công viên giải trí trên đảo Hòn Tre, nổi bật với nhiều trò chơi và hoạt động hấp dẫn.",
//     "Tên địa điểm": "VinWonders Nha Trang",
//     "Đánh giá": "4.6/5",
//     Ảnh: "https://tse1.mm.bing.net/th?id=OIP.5z6-9r5crvDbj01RkeQO2gHaDv&pid=Api&P=0&h=220",
//   },
//   {
//     "Mô tả": "Là khu du lịch sinh thái nổi bật ở Bến Tre...",
//     "Tên địa điểm": "Khu du lịch sinh thái vườn Ba Ngói",
//     "Đánh giá": "4.3/5",
//     Ảnh: "https://mia.vn/media/uploads/blog-du-lich/khu-du-lich-vuon-ba-ngoi-voi-khong-gian-song-nuoc-huu-tinh-3-1667357530.jpg",
//   },
// ];
function RecommendPage() {
  const { dispatch } = useRecommend();
  const initialState = Math.floor(Math.random() * 100);

  useEffect(() => {
    getRecommend(initialState).then((data) => {
      if (data) {
        console.log("effect mouted data loca");
        dispatch({ type: "recommend/getTop5", payload: data.recommendations });
      } else {
        console.log("No list friend");
      }
    });
  }, []);

  return (
    <Grid container>
      <Grid
        item
        flex={2}
        sx={{ overflow: "auto" }}
        display={{ xs: "none", md: "block" }}
      ></Grid>
      <Grid item flex={5} sx={{ mt: 12, height: "100%", overflow: "auto" }}>
        {/* <RecommendSearch /> */}
        <RecommendationList />
      </Grid>
    </Grid>
  );
}
export default RecommendPage;
