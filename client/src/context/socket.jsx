import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false, // Chỉ kết nối khi cần
  reconnection: true, // Tự động kết nối lại nếu mất kết nối
  reconnectionAttempts: 5, // Số lần thử kết nối lại
  reconnectionDelay: 1000, // Thời gian chờ giữa các lần thử
});

export default socket;
