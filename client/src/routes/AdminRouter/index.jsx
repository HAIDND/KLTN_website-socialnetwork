import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import auth from "~/services/authService/authHelper";
import { readUser } from "~/services/userServices/userService";
import { CurrentUser } from "../GlobalContext";

function AdminRoute({ children }) {
  const { currentUser } = useContext(CurrentUser);
  const [isrole, setRole] = useState("");
  const [isAdmin, SetAdmin] = useState();

  useEffect(() => {
    readUser(curentUserID).then((data) => {
      if (data) {
        console.log(data);
        setRole(data);
        if (data?.role == "admin") SetAdmin("admin");
      } else {
        alert("No role");
      }
    });
    console.log(curentUserID);
  }, [currentUser]);
  console.log(isrole);
  if (auth.isAuthenticated() && auth.isAdmin("admin")) return children;
  return <Navigate to="/login" />;
}

export default AdminRoute;
