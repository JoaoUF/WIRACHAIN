import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../hooks";

export const PrivateRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (allowedRoles && user && !allowedRoles.includes(user.role))
    return <Navigate to="/dashboard" />;

  return <>{children}</>;
};
