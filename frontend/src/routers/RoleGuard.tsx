import type { ReactElement } from "react";
import { NotAuthorized } from "../features";
import { useAuth } from "../hooks";
import type { UserType } from "../types";

interface RoleBasedRouteProps {
  allowedRoles: UserType[];
  element: ReactElement;
  fallback?: ReactElement;
}

const RoleGuard = ({
  allowedRoles,
  element,
  fallback = <NotAuthorized />,
}: RoleBasedRouteProps) => {
  const { user } = useAuth();

  if (!user?.groups || !allowedRoles.includes(user.groups)) {
    return fallback;
  }

  return element;
};

export default RoleGuard;
