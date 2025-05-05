import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
    global: "window", // Khắc phục lỗi global is not defined
  },

  // build: {
  //   rollupOptions: {
  //     plugins: [rollupNodePolyFill()],
  //   },
  // },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"), // Tạo alias để import tương đối
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000", // Backend chạy cổng 5000
    },
  },
});
