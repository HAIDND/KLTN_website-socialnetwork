const fs = require("fs");

const NUM_USERS = 200;
const NUM_LOCATIONS = 40;
const MIN_REVIEWS_PER_LOCATION = 4;
const MAX_REVIEWS_PER_USER = 15;

const reviews = new Set();
const userReviewCounts = Array(NUM_USERS + 1).fill(0); // index từ 1–20
const locationReviewMap = {}; // locationId -> Set of userIds

// Bước 1: Đảm bảo mỗi location có ít nhất 4 người dùng đánh giá
for (let loc = 1; loc <= NUM_LOCATIONS; loc++) {
  locationReviewMap[loc] = new Set();
  while (locationReviewMap[loc].size < MIN_REVIEWS_PER_LOCATION) {
    const userId = Math.floor(Math.random() * NUM_USERS) + 1;
    const key = `${userId},${loc}`;

    if (!reviews.has(key) && userReviewCounts[userId] < MAX_REVIEWS_PER_USER) {
      const rating = Math.floor(Math.random() * 6); // 0–5
      reviews.add(`${userId},${loc},${rating}`);
      userReviewCounts[userId]++;
      locationReviewMap[loc].add(userId);
    }
  }
}

// Bước 2: Bổ sung thêm rating random cho user (nếu họ chưa đủ 20 đánh giá)
for (let userId = 1; userId <= NUM_USERS; userId++) {
  const remaining = MAX_REVIEWS_PER_USER - userReviewCounts[userId];
  for (let i = 0; i < remaining; i++) {
    const loc = Math.floor(Math.random() * NUM_LOCATIONS) + 1;
    const key = `${userId},${loc}`;
    if (!reviews.has(key)) {
      const rating = Math.floor(Math.random() * 6);
      reviews.add(`${userId},${loc},${rating}`);
      userReviewCounts[userId]++;
    }
  }
}

// Bước 3: Ghi ra file CSV
const lines = ["userId,locationId,rating", ...Array.from(reviews)];
fs.writeFileSync("ratings.csv", lines.join("\n"));

console.log(`✅ Đã tạo ratings.csv với ${reviews.size} dòng đánh giá.`);
