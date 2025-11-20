import React from "react";
import { DashboardLoading } from "../features";
import { useAuth } from "../hooks";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authChecked } = useAuth();

  if (!authChecked) {
    return <DashboardLoading size="default" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
