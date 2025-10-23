import { createBrowserRouter } from "react-router";
import {
  ActivateAccount,
  Clinic,
  Diesease,
  Doctor,
  ForgotPassword,
  Landing,
  Login,
  NotFound,
  Profile,
  Register,
  Reservation,
  Setting,
  Speciality,
  Test,
  WaitingList,
} from "../features";
import { Dashboard, MainMenu } from "../layouts";
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
    element: <MainMenu />,
    children: [
      {
        index: true,
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
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
      {
        path: ROUTES.ACTIVATE_ACCOUNT,
        element: <ActivateAccount />,
      },
    ],
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
        path: ROUTES.CLINIC,
        element: (
          <RoleGuard allowedRoles={ENTERPRISE_ROLES} element={<Clinic />} />
        ),
      },
      {
        path: ROUTES.DOCTOR,
        element: (
          <RoleGuard allowedRoles={ENTERPRISE_ROLES} element={<Doctor />} />
        ),
      },
      {
        path: ROUTES.DISEASE,
        element: (
          <RoleGuard allowedRoles={ENTERPRISE_ROLES} element={<Diesease />} />
        ),
      },
      {
        path: ROUTES.SPECIALITY,
        element: (
          <RoleGuard allowedRoles={ENTERPRISE_ROLES} element={<Speciality />} />
        ),
      },
      {
        path: ROUTES.TEST,
        element: (
          <RoleGuard allowedRoles={ENTERPRISE_ROLES} element={<Test />} />
        ),
      },
      {
        path: ROUTES.WAITING_LIST,
        element: (
          <RoleGuard
            allowedRoles={[USER_TYPES.DOCTOR]}
            element={<WaitingList />}
          />
        ),
      },
      {
        path: ROUTES.RESERVATION,
        element: (
          <RoleGuard
            allowedRoles={[USER_TYPES.PATIENT]}
            element={<Reservation />}
          />
        ),
      },
      {
        path: ROUTES.SETTING,
        element: (
          <RoleGuard allowedRoles={ALL_USER_ROLES} element={<Setting />} />
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <RoleGuard allowedRoles={ALL_USER_ROLES} element={<Profile />} />
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
