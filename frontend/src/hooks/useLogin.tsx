import { useNavigate } from "react-router";
import { useLoginMutation } from "../redux";
import { ROUTES } from "../routers/routes";
import type { LoginRequest } from "../types";
import { globalMessage } from "../utils/message";
import { useAuth } from "./useAuth";

export const useLogin = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (values: LoginRequest) => {
    try {
      await login(values).unwrap();
      await refetchUser();
      globalMessage.success({
        content: "Login successful!",
        duration: 1.0,
        onClose: () => navigate(ROUTES.DASHBOARD),
      });
    } catch (error) {
      console.error("ERROR ON LOGIN", error);
      globalMessage.error({
        content: "Login failed. Please check your credentials.",
        duration: 1.5,
      });
    }
  };

  return { handleLogin, isLoading };
};
