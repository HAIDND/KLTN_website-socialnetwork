import { API_BASE_URL } from "~/config/apiConfig";

export const createRoom = async () => {
  const response = await fetch(`${API_BASE_URL}/create-room`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  return data.url;
};
