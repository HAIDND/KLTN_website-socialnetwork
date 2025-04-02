import { useContext, useEffect } from "react";
import Header from "~/pages/DefaultLayout/Header";
import Sidebar from "~/pages/DefaultLayout/Sidebar";
import { CurrentUser } from "~/routes/GlobalContext";
import { readUser } from "~/services/userServices/userService";
import Chatbot from "../Chatbot";

function DefaultLayout() {
  // const { currentUser, setCurrentUserInfo, setCurrentUser } =
  //   useContext(CurrentUser);

  // useEffect(() => {
  //   const storedToken = sessionStorage.getItem("jwt");
  //   const tokenData = storedToken ? JSON.parse(storedToken) : null;
  //   function setuser() {
  //     setCurrentUser(tokenData);
  //   }
  //   readUser(tokenData?.userId).then((data) => {
  //     if (data) {
  //       setCurrentUserInfo(data);
  //       setuser();
  //     } else {
  //       alert("No profile");
  //     }
  //   });
  // }, []);
  return (
    <>
      <Header />
      <Sidebar />
      <Chatbot />
    </>
  );
}

export default DefaultLayout;
