import PageNotFound from "~/pages/PageNotFound";

import auth from "~/services/authService/authHelper";

function PublicRoute({ children }) {
  if (auth.isAuthenticated()) return <PageNotFound></PageNotFound>;
  return children;
}

export default PublicRoute;
