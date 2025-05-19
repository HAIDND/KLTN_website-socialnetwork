import { API_BASE_URL } from "~/config/apiConfig";

let fetchController = null;

// GET: Lấy tin nhắn theo groupId
export const getGroupMessage = async (groupId, page = 0, limit = 5) => {
  // Hủy yêu cầu cũ nếu có
  if (fetchController) {
    fetchController.abort();
  }

  fetchController = new AbortController();
  const signal = fetchController.signal;

  try {
    const response = await fetch(
      `${API_BASE_URL}groupmessage/${groupId}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn("Previous fetch aborted");
    } else {
      console.error("Fetch error:", error);
      throw error;
    }
  }
};

// POST: Gửi tin nhắn mới
export const postGroupMessage = async ({
  groupId,
  senderId,
  senderName,
  senderAvatar,
  message,
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}groupmessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId,
        senderId,
        senderName,
        senderAvatar,
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return await response.json();
  } catch (error) {
    console.error("Send error:", error);
    throw error;
  }
};

// PATCH: Thu hồi tin nhắn
export const recallGroupMessage = async (messageId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recall/${messageId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return await response.json();
  } catch (error) {
    console.error("Recall error:", error);
    throw error;
  }
};
