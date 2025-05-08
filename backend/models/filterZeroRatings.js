const fs = require("fs");
const readline = require("readline");

const inputFile = "ratings.csv";
const outputFile = "ratings_filtered.csv";

async function filterRatings() {
  const inputStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  const output = fs.createWriteStream(outputFile);
  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      output.write(line + "\n"); // ghi dòng tiêu đề
      isFirstLine = false;
      continue;
    }

    const [userId, locationId, rating] = line.split(",");
    if (parseInt(rating) !== 0) {
      output.write(`${userId},${locationId},${rating}\n`);
    }
  }

  output.end(() => {
    console.log(`✅ Đã tạo file ${outputFile} (đã lọc rating = 0)`);
  });
}

filterRatings().catch(console.error);
