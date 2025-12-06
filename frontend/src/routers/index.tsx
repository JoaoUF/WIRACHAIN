import { createBrowserRouter } from "react-router";
import { AuthProvider } from "../contexts";
import {
  ActivateAccount,
  Appointment,
  ClinicDetail,
  ClinicManipulate,
  ClinicPanel,
  Disease,
  DoctorDetail,
  DoctorManipulate,
  DoctorPanel,
  ForgotPassword,
  Landing,
  Login,
  MedicalRecord,
  NotFound,
  Profile,
  Register,
  ResendEmail,
  Reservation,
  Setting,
  Speciality,
  Test,
  WaitingList,
} from "../features";
import { Dashboard, MainMenu } from "../layouts";
import { USER_TYPES } from "../types";
import AuthGuard from "./AuthGuard";
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
      {
        path: ROUTES.RESEND_EMAIL,
        element: <ResendEmail />,
      },
    ],
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <AuthProvider>
        <AuthGuard>
          <ProtectedRoute element={<Dashboard />} />
        </AuthGuard>
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <RedirectRouter />,
      },
      {
        path: ROUTES.CLINIC,
        element: (
          <RoleGuard
            allowedRoles={ENTERPRISE_ROLES}
            element={<ClinicPanel />}
          />
        ),
      },
      {
        path: `${ROUTES.CLINIC_DETAIL}/:id`,
        element: (
          <RoleGuard
            allowedRoles={ENTERPRISE_ROLES}
            element={<ClinicDetail />}
          />
        ),
      },
      {
        path: `${ROUTES.CLINIC_MANIPULATE}/:id?`,
        element: (
          <RoleGuard
            allowedRoles={ENTERPRISE_ROLES}
            element={<ClinicManipulate />}
          />
        ),
      },
      {
        path: ROUTES.DOCTOR,
        element: (
          <RoleGuard
            allowedRoles={ENTERPRISE_ROLES}
            element={<DoctorPanel />}
          />
        ),
      },
      {
        path: `${ROUTES.DOCTOR_DETAIL}/:id`,
        element: (
          <RoleGuard
            allowedRoles={ENTERPRISE_ROLES}
            element={<DoctorDetail />}
          />
        ),
      },
      {
        path: `${ROUTES.DOCTOR_MANIPULATE}/:id?`,
        element: (
          <RoleGuard
            allowedRoles={ENTERPRISE_ROLES}
            element={<DoctorManipulate />}
          />
        ),
      },
      {
        path: ROUTES.DISEASE,
        element: (
          <RoleGuard allowedRoles={ENTERPRISE_ROLES} element={<Disease />} />
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
        path: ROUTES.APPOINTMENT,
        element: (
          <RoleGuard
            allowedRoles={[USER_TYPES.DOCTOR]}
            element={<Appointment />}
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
        path: ROUTES.MEDICAL_RECORD,
        element: (
          <RoleGuard
            allowedRoles={[USER_TYPES.PATIENT]}
            element={<MedicalRecord />}
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
