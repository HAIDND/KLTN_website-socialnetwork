const fs = require("fs");
const readline = require("readline");

const inputFile = "ratings_filtered.csv";
const outputFile = "user_stats.csv";

const userMap = {}; // userId -> { locationIds: [], ratings: [] }

async function processCSV() {
  const fileStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let isFirstLine = true;
  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue; // bỏ dòng tiêu đề
    }

    const [userId, locationId, rating] = line.split(",");
    if (!userMap[userId]) {
      userMap[userId] = { locationIds: [], ratings: [] };
    }

    userMap[userId].locationIds.push(Number(locationId));
    userMap[userId].ratings.push(Number(rating));
  }

  // Ghi kết quả ra file CSV
  const lines = ["userId,locationIds,ratings"];
  for (const [userId, data] of Object.entries(userMap)) {
    const locationStr = JSON.stringify(data.locationIds);
    const ratingStr = JSON.stringify(data.ratings);
    lines.push(`${userId},"${locationStr}","${ratingStr}"`);
  }

  fs.writeFileSync(outputFile, lines.join("\n"), "utf8");
  console.log(`✅ Đã tạo ${outputFile}`);
}

processCSV().catch(console.error);
