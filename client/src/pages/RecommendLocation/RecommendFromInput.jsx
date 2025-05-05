import React, { useReducer } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Typography,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const age_groups = ["18-25", "26-35", "36-50", "51+"];
const gender = ["Nam", "Nữ", "Khác"];
const all_travel_interests = [
  "Biển",
  "Lịch sử",
  "Văn hóa",
  "Thiên nhiên",
  "Giải trí",
  "Làng nghề",
  "Thể thao",
  "Du lịch",
  "Nghệ thuật",
  "Ẩm thực",
  "Mua sắm",
  "Công nghệ",
  "Âm nhạc",
  "Xem phim",
  "Đọc sách",
  "Chụp ảnh",
  "Môi trường",
  "Sức khỏe",
];
const income_groups = [
  "Dưới 5 triệu",
  "5 triệu - 10 triệu",
  "10 triệu - 20 triệu",
  "Trên 20 triệu",
];

// reducer
const initialState = {
  age_group: "",
  gender: "",
  travel_interests: [],
  income: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

const RecommendFromInput = () => {
  const [state, dispatch] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem("optionRecommend")) || initialState
  );
  const navigate = useNavigate();

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    dispatch({ type: "SET_FIELD", field, value });
  };

  const handleSubmit = () => {
    localStorage.setItem("optionRecommend", JSON.stringify(state));
    navigate("/home");
  };

  return (
    <Grid container>
      <Grid
        item
        flex={2}
        sx={{ overflow: "auto" }}
        display={{ xs: "none", md: "block" }}
      ></Grid>
      <Grid item flex={10} sx={{ mt: 12, height: "100%", overflow: "auto" }}>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Chọn thông tin cá nhân & sở thích
          </Typography>

          {/* Age Group */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Nhóm tuổi</InputLabel>
            <Select
              value={state.age_group}
              onChange={handleChange("age_group")}
              label="Nhóm tuổi"
            >
              {age_groups.map((age) => (
                <MenuItem key={age} value={age}>
                  {age}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Gender */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Giới tính</InputLabel>
            <Select
              value={state.gender}
              onChange={handleChange("gender")}
              label="Giới tính"
            >
              {gender.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Travel Interests */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Sở thích du lịch</InputLabel>
            <Select
              multiple
              value={state.travel_interests}
              onChange={handleChange("travel_interests")}
              input={<OutlinedInput label="Sở thích du lịch" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {all_travel_interests.map((interest) => (
                <MenuItem key={interest} value={interest}>
                  <Checkbox
                    checked={state.travel_interests.indexOf(interest) > -1}
                  />
                  <ListItemText primary={interest} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Income Group */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Thu nhập</InputLabel>
            <Select
              value={state.income}
              onChange={handleChange("income")}
              label="Thu nhập"
            >
              {income_groups.map((income) => (
                <MenuItem key={income} value={income}>
                  {income}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            Lưu và Tiếp tục
          </Button>
        </Container>
      </Grid>
    </Grid>
  );
};

export default RecommendFromInput;
