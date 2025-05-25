import { URL_recommendSystem } from "~/config/apiConfig";
///read user api `${API_BASE_URL}users/` + userID,   `${API_BASE_URL}/users/`
export const getRecommendContent = async (index) => {
  try {
    let res = await fetch(`${URL_recommendSystem}recommend/${index}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

//get recommend CF
export const getRecommendCollaborate = async (index) => {
  // Lấy dữ liệu từ sessionStorage
  const storedToken = sessionStorage.getItem("jwt");
  // Parse JSON thành object
  const tokenData = storedToken ? JSON.parse(storedToken) : null;
  // Kiểm tra và sử dụng token
  const userId = tokenData.userId;
  try {
    let res = await fetch(`${URL_recommendSystem}recommend-cf/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
