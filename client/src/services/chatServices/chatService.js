// Route lấy danh sách các cuộc trò chuyện của người dùng router.get('/chats', authenticate, getUserChats);
import { API_BASE_URL } from "~/config/apiConfig";
const getChatList = async () => {
  // Lấy dữ liệu từ sessionStorage
  const storedToken = sessionStorage.getItem("jwt");
  // Parse JSON thành object
  const tokenData = storedToken ? JSON.parse(storedToken) : null;
  // Kiểm tra và sử dụng token
  const token = tokenData.token;
  try {
    const response = await fetch(`${API_BASE_URL}chat/chats`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to get chat list");
    }
  } catch (error) {
    console.error(error);
  }
};

// Route lấy tin nhắn giữa hai người dùng router.get('/messages/:userId', authenticate, getMessages);
const getChatWithUser = async (userId, page = 1, limit = 10) => {
  // Lấy dữ liệu từ sessionStorage
  const storedToken = sessionStorage.getItem("jwt");
  // Parse JSON thành object
  const tokenData = storedToken ? JSON.parse(storedToken) : null;
  // Kiểm tra và sử dụng token
  const token = tokenData.token;
  try {
    const response = await fetch(
      `${API_BASE_URL}chat/messages/${userId}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Route gửi tin nhắn router.post('/send',
const sendMessage = async (receiverId, receiverEmail, content) => {
  const storedToken = sessionStorage.getItem("jwt");
  const tokenData = storedToken ? JSON.parse(storedToken) : null;
  const token = tokenData.token;
  try {
    const response = await fetch(`${API_BASE_URL}chat/send`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiverId: receiverId,
        receiverEmail: receiverEmail,
        content: content,
      }),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to get chat list");
    }
  } catch (error) {
    console.error(error);
  }
};
export { getChatList, getChatWithUser, sendMessage };
