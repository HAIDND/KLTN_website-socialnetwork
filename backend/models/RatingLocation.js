const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  locationName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Đảm bảo mỗi user chỉ đánh giá 1 lần cho 1 location
ratingSchema.index({ userId: 1, locationId: 1 }, { unique: true });

const RatingLocation = mongoose.model("RatingLocation", ratingSchema);
module.exports = RatingLocation;
