import type { ReactElement } from "react";
import { Navigate } from "react-router";
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
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return element;
};
