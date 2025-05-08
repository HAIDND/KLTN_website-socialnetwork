const URL_RECOM = "http://127.0.0.1:5000/recommendations";

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

export { postForGetRecommend };
