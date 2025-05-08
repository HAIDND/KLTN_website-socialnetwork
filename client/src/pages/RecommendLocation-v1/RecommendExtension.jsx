import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Rating,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { postForGetRecommend } from "./RecommendService";
function RecommendExtension() {
  const [recommendations, setRecommendations] = useState([]);
  useEffect(() => {
    postForGetRecommend(
      JSON.parse(localStorage.getItem("optionRecommend"))
    ).then((data) => {
      if (data) {
        console.log("effect mouted data loca");
        setRecommendations(data.recommendations);
      } else {
        console.log("No list friend");
      }
    });
  }, []);
  if (recommendations.length < 1) return null;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",

        mb: 3,
        mt: 3,
        position: "absolute",
        left: 1250,
        top: 450,
        height: "100vh",
        overflowY: "auto",
        background: "##fff",
        borderRadius: "2rem",
        boxShadow: 5,
        maxWidth: "330px",
      }}
    >
      <Typography variant="h5" sx={{ textAlign: "center" }} color="primary">
        Gợi ý du lịch
      </Typography>

      <List>
        {recommendations.map((item, index) => (
          <RecommendationItem key={index} item={item} />
        ))}
      </List>
    </Box>
  );
}
export default RecommendExtension;
function RecommendationItem({ item }) {
  return (
    <ListItem
      sx={{
        display: "flex",
        alignItems: "flex-start",
        cursor: "pointer",
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt={item["Tên địa điểm"]}
          src={item["Ảnh"]}
          sx={{ width: 60, height: 60, mr: 2 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography fontWeight="bold">{item["Tên địa điểm"]}</Typography>
        }
        secondary={
          <>
            <Rating
              value={parseFloat(item["Đánh giá"])}
              precision={0.1}
              readOnly
              size="small"
            />
            <Typography
              variant="body2"
              sx={{ display: "block", mt: 0.5 }}
              color="text.secondary"
            >
              {item["Mô tả"].slice(0, 90)}...
            </Typography>
          </>
        }
      />
    </ListItem>
  );
}
