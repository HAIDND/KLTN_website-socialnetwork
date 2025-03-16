// import ChatFriend from "./components/ChatFriend";
// import Chatbot from "./components/Chatbot";
import GlobalContext from "./routes/GlobalContext";
import HomePage from "~/pages/Home/index";
import { routesArray } from "~/routes/AppRoutes.jsx";
import { useRoutes } from "react-router-dom";
import DefaultLayout from "./pages/DefaultLayout/DefaultLayout";
import auth from "./services/authService/authHelper";
function App() {
  const AppRoutes = useRoutes(routesArray);
  return (
    <GlobalContext>
      {auth.isAuthenticated() && <DefaultLayout />}
      {/* >
      <Chatbot /> */}
      <>{AppRoutes}</>
    </GlobalContext>
  );
}

export default App;
