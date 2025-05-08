const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  dateOfBirth: { type: Date },
  phone: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const Users = mongoose.model("Users", userSchema);
const url = "mongodb://localhost:27017/my-social-network";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    importCSV();
  })
  .catch((err) => console.error("MongoDB connection error:", err));
// mongoose
//   .connect("mongodb://localhost:27017/my-social-network") // sửa tên DB
//   .then(() => {
//     console.log("MongoDB connected");
//     importCSV();
//   })
//   .catch((err) => console.error("MongoDB connection error:", err));
async function importCSV() {
  const users = [];
  fs.createReadStream("users.csv")
    .pipe(csv())
    .on("data", async (row) => {
      console.log(row);
      const hashedPassword = await bcrypt.hash(row.password, 10);
      users.push({
        ...row,
        password: hashedPassword,
        // dateOfBirth: new Date(row.dateOfBirth),
      });
    })
    .on("end", async () => {
      try {
        console.log(users);
        await Users.insertMany(users);
        console.log("Users imported successfully");
        mongoose.disconnect();
      } catch (error) {
        console.error("Error importing users:", error);
        mongoose.disconnect();
      }
    });
}
