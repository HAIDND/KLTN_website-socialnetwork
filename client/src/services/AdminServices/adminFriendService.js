// Friendship routes

import { API_BASE_URL } from "~/config/apiConfig";

// router.get("/friendships", authenticateToken, adminMiddleware, AdminController.getAllFriendships);
const adminGetFriendShips = async () => {
  // Lấy dữ liệu từ sessionStorage
  const storedToken = sessionStorage.getItem("jwt");
  // Parse JSON thành object
  const tokenData = storedToken ? JSON.parse(storedToken) : null;
  // Kiểm tra và sử dụng token
  const token = tokenData.token;
  try {
    const response = await fetch(`${API_BASE_URL}admin/friendships`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
// router.delete("/friendships/:friendshipId", authenticateToken, adminMiddleware, AdminController.deleteFriendship);
const adminDeleteFriendships = async (userId) => {
  // Lấy dữ liệu từ sessionStorage
  const storedToken = sessionStorage.getItem("jwt");
  // Parse JSON thành object
  const tokenData = storedToken ? JSON.parse(storedToken) : null;
  // Kiểm tra và sử dụng token
  const token = tokenData.token;
  try {
    const response = await fetch(`${API_BASE_URL}admin/friendships/${userId}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
export { adminGetFriendShips, adminDeleteFriendships };
