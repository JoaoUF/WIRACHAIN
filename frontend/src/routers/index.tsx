import { createBrowserRouter } from "react-router";
import {
  ActivateAccount,
  Landing,
  Login,
  NotFound,
  Register,
} from "../features";
import { Dashboard } from "../layouts";
import { USER_TYPES } from "../types";
import { ProtectedRoute } from "./ProtectedRoute";
import RedirectRouter from "./RedirectRouter";
import RoleGuard from "./RoleGuard";
import { ROUTES } from "./routes";

const ENTERPRISE_ROLES = [
  USER_TYPES.ENTERPRISE_BASIC,
  USER_TYPES.ENTERPRISE_PREMIUM,
  USER_TYPES.ENTERPRISE_PROFESSIONAL,
];

const ALL_USER_ROLES = [
  USER_TYPES.DOCTOR,
  USER_TYPES.PATIENT,
  ...ENTERPRISE_ROLES,
];

const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <Landing />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.ACTIVATE_ACCOUNT,
    element: <ActivateAccount />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <ProtectedRoute element={<Dashboard />} />,
    children: [
      {
        index: true,
        element: <RedirectRouter />,
      },
      {
        path: ROUTES.DOCTOR,
        element: (
          <RoleGuard
            allowedRoles={[USER_TYPES.DOCTOR]}
            element={<h1>doctor</h1>}
          />
        ),
      },
      {
        path: ROUTES.PATIENT,
        element: (
          <RoleGuard
            allowedRoles={[USER_TYPES.PATIENT]}
            element={<h1>patient</h1>}
          />
        ),
      },
      {
        path: ROUTES.ENTERPRISE,
        element: (
          <RoleGuard
            allowedRoles={ENTERPRISE_ROLES}
            element={<h1>enteprises</h1>}
          />
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <RoleGuard
            allowedRoles={ALL_USER_ROLES}
            element={<h1>all users</h1>}
          />
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export { router };
