import { useContext, useEffect } from "react";
import Header from "~/pages/DefaultLayout/Header";
import Sidebar from "~/pages/DefaultLayout/Sidebar";
import { CurrentUser } from "~/context/GlobalContext";
import { readUser } from "~/services/userServices/userService";
import Chatbot from "../Chatbot";

function DefaultLayout() {
  return (
    <>
      <Header />
      <Sidebar />
      <Chatbot />
    </>
  );
}

export default DefaultLayout;
