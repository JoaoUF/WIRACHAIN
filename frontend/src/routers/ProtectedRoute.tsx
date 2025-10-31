import type { ReactElement } from "react";
import { Navigate } from "react-router";
import { DashboardLoading } from "../features";
import { useAuth } from "../hooks";
import { ROUTES } from "./routes";

interface ProtectedRouteProps {
  element: ReactElement;
  redirectPath?: string;
}

export const ProtectedRoute = ({
  element,
  redirectPath = ROUTES.ROOT,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <DashboardLoading size="default" />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return element;
};
