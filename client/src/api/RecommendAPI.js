import { URL_recommendSystem } from "~/config/apiConfig";
///read user api `${API_BASE_URL}users/` + userID,   `${API_BASE_URL}/users/`
export const getRecommendContent = async (index) => {
  try {
    console.log(`${URL_recommendSystem}${index}`);
    let res = await fetch(`${URL_recommendSystem}${index}`, {
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

// method: "GET",
// headers: {
//   "Content-Type": "application/json",
//   Accept: "application/json",
// },
// body: JSON.stringify(option_user),
// });

// if (!res.ok) {
// throw new Error(`Server trả về lỗi status: ${res.status}`);
// }

// const data = await res.json();
// console.log("Kết quả từ backend:", data);
// return data;
// } catch (err) {
// console.error("Lỗi khi gọi API:", err.message);
// return null;
// }
// }
