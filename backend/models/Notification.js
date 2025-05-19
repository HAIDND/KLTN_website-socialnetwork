// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      ref: "User",
    },
    senderName: {
      type: String,
      // required: true,
    },
    senderAvatar: {
      type: String,
      // required: true,
    },
    receiverId: {
      type: String,
      ref: "User",
      required: true,
    },
    receiverName: {
      type: String,
    },
    type: {
      type: String,
      // enum: ["like", "comment", "message", "follow", "post"],
      required: true,
    },
    postId: {
      type: String,
      ref: "Post",
      default: null,
    },
    messageId: {
      type: String,
      ref: "Message",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);

// 	Giải thích
// senderId	ID của user tạo thông báo (vd: người like, nhắn tin)
// receiverId	ID của user nhận thông báo
// type	Loại thông báo: like, comment, message, post, follow...
// postId	Nếu là thông báo liên quan đến post
// messageId	Nếu là thông báo liên quan đến tin nhắn
// isRead	Đã đọc hay chưa
// timestamps	Tự động tạo createdAt và updatedAt
