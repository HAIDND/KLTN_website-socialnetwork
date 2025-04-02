// Group routes

import { API_BASE_URL } from "~/config/apiConfig";

// router.get("/groups", authenticateToken, adminMiddleware, AdminController.getAllGroups);
const adminGetGroup = async () => {
  // Lấy dữ liệu từ sessionStorage
  const storedToken = sessionStorage.getItem("jwt");
  // Parse JSON thành object
  const tokenData = storedToken ? JSON.parse(storedToken) : null;
  // Kiểm tra và sử dụng token
  const token = tokenData.token;
  try {
    const response = await fetch(`${API_BASE_URL}admin/groups`, {
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
// router.delete("/groups/:groupId", authenticateToken, adminMiddleware, AdminController.deleteGroup);
const adminDeleteGroup = async (groupID) => {
  // Lấy dữ liệu từ sessionStorage
  const storedToken = sessionStorage.getItem("jwt");
  // Parse JSON thành object
  const tokenData = storedToken ? JSON.parse(storedToken) : null;
  // Kiểm tra và sử dụng token
  const token = tokenData.token;
  try {
    const response = await fetch(`${API_BASE_URL}admin/groups/${groupID}`, {
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
export { adminGetGroup, adminDeleteGroup };
