const URL_RECOM = "http://localhost:4000/api/locations";

//get all location
async function getAllLocations(page, limit = 10) {
  //   const body = JSON.stringify(option_user);
  //   console.log(body);
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
    console.log("Kết quả từ backend:", data);
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

export { getAllLocations, postRatingLocation, postForGetRecommend };
