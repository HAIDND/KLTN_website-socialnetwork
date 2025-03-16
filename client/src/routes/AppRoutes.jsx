import PublicRoute from "./PublicRouter";
import PrivateRoute from "./PrivateRouter";
import AdminRoute from "./AdminRouter";
import HomePage from "../pages/Home";
import ChatFriend from "../components/ChatFriend";
import Newsfeed from "~/pages/NewFeed";
import Profile from "~/pages/ProfileUsers";
import FriendPage from "~/pages/Friends/FriendPage";
import GroupPage from "~/pages/Group/GroupPage";
import ListGroup from "~/pages/Group/ListGroup";
import ListGroupAll from "~/pages/Group/ListGroupAll";
import CreateGroup from "~/pages/Group/CreateGroup";
import FormEditGroup from "~/pages/Group/FormEditGroup";
import DetailGroup from "~/pages/Group/DetailGroup";
import SettingsPage from "~/pages/SettingsPage";
import DeleteAccountDialog from "~/pages/SettingsPage/DeleteAccount";
import EditProfile from "~/pages/SettingsPage/EditProfile";
import RealtimeChat from "~/pages/RealtimeFeature/RealtimeChat";

export const routesArray = [
  ///public routes

  {
    path: "*",
    element: (
      <PublicRoute>
        <HomePage login={true} />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <HomePage login={true} />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <HomePage login={false} />
      </PublicRoute>
    ),
  },

  ///private routes
  {
    path: "/chat",
    element: (
      <PrivateRoute>
        <RealtimeChat />
      </PrivateRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <PrivateRoute>
        <Newsfeed />
      </PrivateRoute>
    ),
  },
  {
    path: "/newsfeed",
    element: (
      <PrivateRoute>
        <Newsfeed />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/friends",
    element: (
      <PrivateRoute>
        <FriendPage />
      </PrivateRoute>
    ),
  },
  // {
  //   path: "/home",
  //   element: (
  //     <PrivateRoute>
  //       <Newsfeed />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: "/newsfeed",
  //   element: (
  //     <PrivateRoute>
  //       <Newsfeed />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: "/home",
  //   element: (
  //     <PrivateRoute>
  //       <Newsfeed />
  //     </PrivateRoute>
  //   ),
  // }, ///testing
  // {
  //   path: "/testing",
  //   element: (
  //     <PrivateRoute>
  //       <ChatFriend />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: "/newsfeed",
  //   element: (
  //     <PrivateRoute>
  //       <Newsfeed />
  //     </PrivateRoute>
  //   ),
  // },

  // //group 6x
  {
    path: "/groups",
    element: (
      <PrivateRoute>
        <GroupPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/groups/mygroup",
    element: (
      <PrivateRoute>
        <ListGroup />
      </PrivateRoute>
    ),
  },
  {
    path: "/groups/explore",
    element: (
      <PrivateRoute>
        <ListGroupAll />
      </PrivateRoute>
    ),
  },
  {
    path: "/groups/create",
    element: (
      <PrivateRoute>
        <CreateGroup />
      </PrivateRoute>
    ),
  },
  {
    path: "/groups/update",
    element: (
      <PrivateRoute>
        <FormEditGroup />
      </PrivateRoute>
    ),
  },
  {
    path: "/groups/:id",
    element: (
      <PrivateRoute>
        <DetailGroup />
      </PrivateRoute>
    ),
  },
  // //settings
  {
    path: "/settings",
    element: (
      <PrivateRoute>
        <SettingsPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/settings/editprofile",
    element: (
      <PrivateRoute>
        <EditProfile />
      </PrivateRoute>
    ),
  },
  {
    path: "/settings/deleteaccount",
    element: (
      <PrivateRoute>
        <DeleteAccountDialog />
      </PrivateRoute>
    ),
  },
  // {
  //   path: "*",
  //   element: (
  //     <PrivateRoute>
  //       <PageNotFound />
  //     </PrivateRoute>
  //   ),
  // },
  // //admin rotes
  // {
  //   path: "/admin",
  //   element: (
  //     <AdminRoute>
  //       <AdminPage />
  //     </AdminRoute>
  //   ),
  // },
];
