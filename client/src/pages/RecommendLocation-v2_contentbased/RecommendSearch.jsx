import React, { useReducer } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Box,
} from "@mui/material";
import { Label } from "@mui/icons-material";
import { useRecommend } from "./RecommendContext";

// Dữ liệu đầu vào
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
const locations = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
  "Hà Nội",
  "Hồ Chí Minh",
  "Cần Thơ",
  "Đà Nẵng",
  "Hải Phòng",
];

// State reducer
const initialState = {
  age: "",
  gender: "",
  travel_interests: [],
  income: "",
  education: "",
};

function reducer(state, action) {
  return { ...state, [action.field]: action.value };
}
function RecommendSearch() {
  const { optionRecommend, dispatch } = useRecommend();

  const handleChange = (field) => (event) => {
    dispatch({
      field,
      value: event.target.value,
    });
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={2} p={2}>
      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel>Age group</InputLabel>
        <Select
          value={optionRecommend.age_group}
          onChange={handleChange("age_group")}
          label="Độ tuổi"
        >
          {age_groups.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel>Gender</InputLabel>
        <Select
          value={optionRecommend.gender}
          onChange={handleChange("gender")}
          label="Giới tính"
        >
          {gender.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 220 }}>
        <InputLabel>Interest</InputLabel>
        <Select
          multiple
          value={optionRecommend.travel_interests}
          onChange={handleChange("travel_interests")}
          input={<OutlinedInput label="Sở thích" />}
          renderValue={(selected) => selected.join(", ")}
        >
          {all_travel_interests.map((interest) => (
            <MenuItem key={interest} value={interest}>
              <Checkbox
                checked={
                  optionRecommend.travel_interests.indexOf(interest) > -1
                }
              />
              <ListItemText primary={interest} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel>Icome</InputLabel>
        <Select
          value={optionRecommend.income}
          onChange={handleChange("income")}
          label="Thu nhập"
        >
          {income_groups.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel>Location</InputLabel>
        <Select
          value={optionRecommend.location}
          onChange={handleChange("location")}
          label="Khu vực"
        >
          {locations.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
export default RecommendSearch;
