import auth from "~/services/authService/authHelper";

export const postRequestGoogleLogin = async (credentialResponse) => {
  try {
    const res = await fetch("http://localhost:4000/api/google/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: credentialResponse.credential,
      }),
    });

    if (!res.ok) {
      throw new Error("Lỗi từ server: " + res.status);
    }

    const data = await res.json();
    console.log("Đăng nhập thành công:", data);
    auth.authenticate(data, () => {});
    return data;
    // Lưu token nếu cần
    // localStorage.setItem("token", data.token);
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
  }
};
