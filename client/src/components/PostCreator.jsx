import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Typography,
  Stack,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import { Image, Mood, LocationOn, Public, Lock, People, Cancel } from "@mui/icons-material";

const emotions = [
  { label: "😊 Vui", icon: "😊" },
  { label: "😢 Buồn", icon: "😢" },
  { label: "😡 Tức giận", icon: "😡" },
  { label: "😍 Hạnh phúc", icon: "😍" },
];

const privacyOptions = [
  { label: "Công khai", icon: <Public />, value: "public" },
  { label: "Bạn bè", icon: <People />, value: "friends" },
  { label: "Riêng tư", icon: <Lock />, value: "private" },
];

const PostCreator = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [emotion, setEmotion] = useState(null);
  const [location, setLocation] = useState("");
  const [privacy, setPrivacy] = useState("public");

  // Xử lý chọn ảnh
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 6) {
      alert("Chỉ được chọn tối đa 6 ảnh!");
      return;
    }
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...imageUrls]);
  };

  // Xóa ảnh đã chọn
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Chọn cảm xúc
  const handleSelectEmotion = (selected) => {
    setEmotion(selected === emotion ? null : selected);
  };

  // Lấy vị trí GPS
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        () => {
          alert("Không thể lấy vị trí, vui lòng thử lại!");
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ GPS.");
    }
  };

  // Xử lý đăng bài
  const handlePost = () => {
    console.log({ content, images, emotion, location, privacy });
    alert("Bài viết đã được đăng!");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: 500,
        p: 3,
        borderRadius: 3,
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Avatar src="https://i.pravatar.cc/150?img=3" />
        <Box>
          <Typography fontWeight="bold">Người Dùng</Typography>
          <TextField
            select
            size="small"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            sx={{ width: 140, mt: 1 }}
          >
            {privacyOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.icon} {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Input nội dung */}
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Bạn đang nghĩ gì?"
        variant="outlined"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Hiển thị ảnh đã chọn */}
      {images.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {images.map((img, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                width: 80,
                height: 80,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #ddd",
              }}
            >
              <img
                src={img}
                alt={`selected-${index}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <IconButton
                onClick={() => removeImage(index)}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  padding: "2px",
                }}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}

      {/* Chọn ảnh, cảm xúc, địa điểm */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <IconButton component="label">
          <Image color="primary" />
          <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
        </IconButton>

        {emotions.map((item) => (
          <Chip
            key={item.label}
            label={item.icon}
            onClick={() => handleSelectEmotion(item.label)}
            color={emotion === item.label ? "primary" : "default"}
          />
        ))}

        <IconButton onClick={getLocation}>
          <LocationOn color={location ? "secondary" : "default"} />
        </IconButton>
      </Stack>

      {/* Hiển thị vị trí nếu có */}
      {location && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {location}
        </Typography>
      )}

      {/* Nút Đăng */}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ borderRadius: 2 }}
        onClick={handlePost}
        disabled={!content && images.length === 0}
      >
        Đăng bài
      </Button>
    </Paper>
  );
};

export default PostCreator;
