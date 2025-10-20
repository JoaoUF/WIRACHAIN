import { Navigate } from "react-router";
import { useAuth } from "../hooks";
import { USER_TYPES } from "../types";
import { ROUTES } from "./routes";

interface RoleRedirectMap {
  [key: string]: string;
}

const ROLE_REDIRECT_MAP: RoleRedirectMap = {
  [USER_TYPES.DOCTOR]: ROUTES.DOCTOR,
  [USER_TYPES.ENTERPRISE_BASIC]: ROUTES.ENTERPRISE,
  [USER_TYPES.ENTERPRISE_PREMIUM]: ROUTES.ENTERPRISE,
  [USER_TYPES.ENTERPRISE_PROFESSIONAL]: ROUTES.ENTERPRISE,
  [USER_TYPES.PATIENT]: ROUTES.PATIENT,
};

function RedirectRouter() {
  const { user } = useAuth();

  const targetRoute = user?.role
    ? ROLE_REDIRECT_MAP[user.role] || ROUTES.ROOT
    : ROUTES.ROOT;

  return <Navigate to={targetRoute} replace />;
}

export default RedirectRouter;
