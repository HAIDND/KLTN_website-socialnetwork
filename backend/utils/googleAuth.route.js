// const express = require("express");
// const cors = require("cors");

// const jwt = require("jsonwebtoken");

// const app = express();
// app.use(cors());
// app.use(express.json());

// MongoDB connect
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("MongoDB error:", err));

// // User Schema
// const User = mongoose.model(
//   "User",
//   new mongoose.Schema({
//     email: String,
//     name: String,
//     picture: String,
//     googleId: String,
//   })
// );
//
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const User = require("../models/User");
const googleAuthRoute = require("express").Router();
const { OAuth2Client } = require("google-auth-library");
// Google OAuth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// googleAuthRoute.post("/:groupId", getGroupMessage); // Lấy tin nhắn của nhóm ko auth
googleAuthRoute.post("/auth", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar,
      dateOfBirth,
      gender,
      phone,
      role,
    });

    await newUser.save();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        googleId: sub,
      });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token: jwtToken, user });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(400).json({ error: "Login failed" });
  }
});

const TempUserSchema = new mongoose.Schema({
  email: String,
  password: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Xóa sau 5 phút
});
const TempUser = mongoose.model("TempUser", TempUserSchema);

// // Step 1: Người dùng gửi email + password
// app.post("/api/auth/register", async (req, res) => {
//   const { email, password } = req.body;
//   const otp = Math.floor(100000 + Math.random() * 900000).toString(); // OTP 6 chữ số

//   await TempUser.create({ email, password, otp });
//   await sendMail(email, otp);
//   res.json({ message: "OTP đã được gửi đến email." });
// });

// // Step 2: Xác minh OTP
// app.post("/api/auth/verify-otp", async (req, res) => {
//   const { email, otp } = req.body;
//   const tempUser = await TempUser.findOne({ email, otp });

//   if (!tempUser) {
//     return res.status(400).json({ error: "OTP không đúng hoặc đã hết hạn." });
//   }

//   // Tạo user chính thức
//   await User.create({ email: tempUser.email, password: tempUser.password });
//   await TempUser.deleteOne({ _id: tempUser._id });

//   res.json({ message: "Đăng ký thành công!" });
// });

module.exports = googleAuthRoute;
