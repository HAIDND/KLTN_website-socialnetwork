///call get notifi
import { API_BASE_URL } from "~/config/apiConfig";
const getNotifi = async () => {
  const storedToken = sessionStorage.getItem("jwt");
  // Parse JSON thành object
  const tokenData = storedToken ? JSON.parse(storedToken) : null;
  // Kiểm tra và sử dụng token
  const token = tokenData.token;

  try {
    const response = await fetch(`${API_BASE_URL}notification`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    });
    if (response?.statusText === "Unauthorized") {
      sessionStorage.removeItem("jwt");
    }
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};
///call read notifi

const readNotifi = async (notificationId) => {
  const storedToken = sessionStorage.getItem("jwt");
  // Parse JSON thành object
  const tokenData = storedToken ? JSON.parse(storedToken) : null;
  // Kiểm tra và sử dụng token
  const token = tokenData.token;

  const form = {
    notificationId,
  };

  try {
    const response = await fetch(`${API_BASE_URL}notification/read`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });

    return await response.json();
  } catch (error) {
    console.log("notifi log");

    console.log(error);
  }
};
export { getNotifi, readNotifi };
