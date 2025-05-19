const mongoose = require("mongoose");
const { Schema } = mongoose;

const groupMessageSchema = new Schema(
  {
    groupId: {
      type: String,
      ref: "Group",
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "video"],
      default: "text",
    },
    seenBy: [
      {
        userId: { type: String, ref: "User" },
        seenAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Gợi ý index để phân trang, truy xuất nhanh
groupMessageSchema.index({ groupId: 1, createdAt: -1 });

module.exports = mongoose.model("GroupMessages", groupMessageSchema);
