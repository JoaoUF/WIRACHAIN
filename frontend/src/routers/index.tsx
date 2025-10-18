import { createBrowserRouter } from "react-router";
import {
  ActivateAccount,
  Landing,
  Login,
  NotFound,
  Register,
} from "../features";

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
