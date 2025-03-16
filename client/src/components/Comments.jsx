import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import { Send, Image, Cancel } from "@mui/icons-material";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([
    {
      id: 1,
      userAvatar: "https://i.pravatar.cc/150?img=8",
      userName: "Trần Minh",
      text: "Bài viết hay quá!",
      image: "https://source.unsplash.com/random/100x100?sig=1",
    },
  ]);
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState(null);

  // Xử lý nhập nội dung bình luận
  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  // Chọn ảnh bình luận (chỉ chọn 1 ảnh)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCommentImage(URL.createObjectURL(file));
    }
  };

  // Xóa ảnh đã chọn
  const removeImage = () => {
    setCommentImage(null);
  };

  // Gửi bình luận
  const handleSendComment = () => {
    if (!commentText && !commentImage) return;

    const newComment = {
      id: comments.length + 1,
      userAvatar: "https://i.pravatar.cc/150?img=10",
      userName: "Bạn",
      text: commentText,
      image: commentImage,
    };

    setComments([...comments, newComment]);
    setCommentText("");
    setCommentImage(null);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 3 }}>
      {/* Danh sách bình luận */}
      <Stack spacing={2}>
        {comments.map((comment) => (
          <Stack direction="row" spacing={2} key={comment.id} alignItems="flex-start">
            <Avatar src={comment.userAvatar} />
            <Box>
              <Typography fontWeight="bold">{comment.userName}</Typography>
              <Typography variant="body2" sx={{ backgroundColor: "#f0f2f5", p: 1, borderRadius: 2 }}>
                {comment.text}
              </Typography>
              {comment.image && (
                <Box
                  component="img"
                  src={comment.image}
                  sx={{ width: 80, height: 80, mt: 1, borderRadius: 2 }}
                />
              )}
            </Box>
          </Stack>
        ))}
      </Stack>

      {/* Ô nhập bình luận */}
      <Stack direction="row" spacing={2} mt={2} alignItems="center">
        <Avatar src="https://i.pravatar.cc/150?img=3" />
        <TextField
          fullWidth
          size="small"
          placeholder="Viết bình luận..."
          value={commentText}
          onChange={handleCommentChange}
          sx={{ backgroundColor: "#f0f2f5", borderRadius: 2 }}
        />
        <IconButton component="label">
          <Image color="primary" />
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </IconButton>
        <IconButton color="primary" onClick={handleSendComment} disabled={!commentText && !commentImage}>
          <Send />
        </IconButton>
      </Stack>

      {/* Hiển thị ảnh đã chọn + nút xóa ảnh */}
      {commentImage && (
        <Box mt={1} position="relative" width={80} height={80}>
          <img src={commentImage} alt="preview" style={{ width: "100%", height: "100%", borderRadius: 4 }} />
          <IconButton
            onClick={removeImage}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "white",
              p: "2px",
            }}
          >
            <Cancel fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
};

export default Comments;
