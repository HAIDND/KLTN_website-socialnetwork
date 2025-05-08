const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const authenticateToken = require("../middlewares/authenticateToken");

const localtionController = require("../controllers/locationsController");

// API tạo bài viết
// router.post(
//   "/create",
//   authenticateToken,
//   upload.single("image"),
//   postController.createPost
// );

// API lấy danh sách bài viết của người dùng
router.get("/:id?", localtionController.getLocations);
//api tạo ration cho1 location
router.post("/rating", localtionController.postRatingLocation);
module.exports = router;
