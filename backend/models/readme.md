bước 1 kiểm tra và installl thư viện fs nếu chưa có
bước 2 chạy lấy data
node generateRatingsCSV.js
bước 3 chạy lọc các rating 0===null, file này đủ 3 cột train đc
node filterZeroRatings.js
bước 4 chạy lấy file kiểm tra tính chính xác()
node generateUserStatsCSV.js
