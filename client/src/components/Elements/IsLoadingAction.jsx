import React from "react";
import { CircularProgress, Box } from "@mui/material";

const IsLoadingAction = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(128, 128, 128, 0.6)", // màu xám mờ, opacity 0.6
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300, // cao hơn để đè lên nội dung khác
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default IsLoadingAction;
