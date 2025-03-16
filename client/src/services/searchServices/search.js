///call api search keyword
import { API_BASE_URL } from "~/config/apiConfig";
const searchHeader = async (query) => {
    // Lấy dữ liệu từ sessionStorag
    const storedToken = sessionStorage.getItem("jwt");
    // Parse JSON thành object
    const tokenData = storedToken ? JSON.parse(storedToken) : null;
    // Kiểm tra và sử dụng token
    const token = tokenData.token;
    //sử lí data
    const form = {
        query,
    };
    console.log("data send " + form);
    try {
        const response = await fetch(`${API_BASE_URL}users/search/` + query, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
        });
        return await response.json();
    } catch (error) {
        alert(error?.message);
    }
};

export { searchHeader };
