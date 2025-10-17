import { createBrowserRouter } from "react-router";
import ActivateAccount from "../features/authentication/ActivateAccount";
import Login from "../features/authentication/Login";
import Register from "../features/authentication/Register";
import Landing from "../features/navigation/Landing";
import NotFound from "../features/navigation/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/activate-account/:activate_code",
    element: <ActivateAccount />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export { router };
