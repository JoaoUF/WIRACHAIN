import type { ReactElement } from "react";
import { NotFound } from "../features";
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
  fallback = <NotFound />,
}: RoleBasedRouteProps) => {
  const { user } = useAuth();

  if (!user?.groups || !allowedRoles.includes(user.groups)) {
    return fallback;
  }

  return element;
};

export default RoleGuard;
