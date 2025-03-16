// import { io } from "socket.io-client";
// const URL = "http://localhost:5000";

// export const socket = io(URL);
//RESTFUl API backend
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/";

export { API_BASE_URL };
