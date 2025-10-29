import { Navigate } from "react-router";
import { useAuth } from "../hooks";
import { USER_TYPES } from "../types";
import { ROUTES } from "./routes";

interface RoleRedirectMap {
  [key: string]: string;
}

const ROLE_REDIRECT_MAP: RoleRedirectMap = {
  [USER_TYPES.DOCTOR]: ROUTES.WAITING_LIST,
  [USER_TYPES.ENTERPRISE_BASIC]: ROUTES.CLINIC,
  [USER_TYPES.ENTERPRISE_PREMIUM]: ROUTES.CLINIC,
  [USER_TYPES.ENTERPRISE_PROFESSIONAL]: ROUTES.CLINIC,
  [USER_TYPES.PATIENT]: ROUTES.RESERVATION,
};

function RedirectRouter() {
  const { user } = useAuth();

  const targetRoute = user?.groups
    ? ROLE_REDIRECT_MAP[user.groups]
    : ROUTES.ROOT;

  return <Navigate to={targetRoute} replace />;
}

export default RedirectRouter;
