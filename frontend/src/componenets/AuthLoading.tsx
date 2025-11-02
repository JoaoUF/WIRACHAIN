import { RouterProvider } from "react-router";
import { DashboardLoading } from "../features";
import { useAuth } from "../hooks";
import { router } from "../routers";

export function AuthLoading() {
  const { authChecked } = useAuth();

  if (!authChecked) {
    return <DashboardLoading size="default" />;
  }

  return <RouterProvider router={router} />;
}
