import GlobalContext from "./context/GlobalContext";
import { routesArray } from "~/routes/AppRoutes.jsx";
import { useRoutes } from "react-router-dom";
import DefaultLayout from "./pages/DefaultLayout/DefaultLayout";
import auth from "./services/authService/authHelper";

import CallVideos from "./pages/Chatting/CallVideos";
import ScrollToTopButton from "./components/Elements/ScrollToTopButton";
function App() {
  const AppRoutes = useRoutes(routesArray);
  return (
    <GlobalContext>
      {" "}
      <CallVideos />
      {auth.isAuthenticated() && <DefaultLayout />}
      {/* >
      <Chatbot /> */}
      <>{AppRoutes}</>
      <ScrollToTopButton />
    </GlobalContext>
  );
}

export default App;
