const URL_RECOM = "http://localhost:4000/api/locations";

//get all location
async function getAllLocations(page, limit = 10) {
  try {
    const res = await fetch(`${URL_RECOM}/?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Server trả về lỗi status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Lỗi khi gọi API:", err.message);
    return null;
  }
}

//post rating location
async function postRatingLocation(formData) {
  //   const body = JSON.stringify(option_user);
  //   console.log(body);
  console.log("formData", formData);
  try {
    const res = await fetch(`${URL_RECOM}/rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error(`Server trả về lỗi status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Kết quả từ backend:", data);
    return data;
  } catch (err) {
    console.error("Lỗi khi gọi API:", err.message);
    return null;
  }
}
//get rating in a location
async function getRatingInLocation({ page, locationId }) {
  const limit = 2;
  try {
    const res = await fetch(
      `${URL_RECOM}/ratinginlocation/?page=${page}&locationId=${locationId}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Server trả về lỗi status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Lỗi khi gọi API:", err.message);
    return null;
  }
}
async function getMyRatingInLocations(locationId) {
  // Lấy dữ liệu từ sessionStorage
  const storedToken = sessionStorage.getItem("jwt");
  // Parse JSON thành object
  const tokenData = storedToken ? JSON.parse(storedToken) : null;
  // Kiểm tra và sử dụng token
  const userId = tokenData.userId;
  console.log("my raitng in location id", locationId);
  try {
    const res = await fetch(
      `${URL_RECOM}/myrating/?locationId=${locationId}&userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Server trả về lỗi status: ${res.status}`);
    }
    const data = await res.json();
    console.log("Kết quả từ get rating in location:", data);
    return data;
  } catch (err) {
    console.error("Lỗi khi gọi API:", err.message);
    return null;
  }
}
async function postForGetRecommend(option_user) {
  //   const body = JSON.stringify(option_user);
  //   console.log(body);
  try {
    const res = await fetch(URL_RECOM, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(option_user),
    });

    if (!res.ok) {
      throw new Error(`Server trả về lỗi status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Kết quả từ backend:", data);
    return data;
  } catch (err) {
    console.error("Lỗi khi gọi API:", err.message);
    return null;
  }
}

export {
  getAllLocations,
  postRatingLocation,
  getRatingInLocation,
  getMyRatingInLocations,
  postForGetRecommend,
};
