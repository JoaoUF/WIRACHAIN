import { message } from "antd";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../redux";
import { ROUTES } from "../routers/routes";
import type { LoginRequest } from "../types";

export const useLogin = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (values: LoginRequest) => {
    try {
      await login(values).unwrap();
      message.success("Login successful!");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error("ERROR ON LOGIN", error);
      message.error("Login failed. Please check your credentials.");
    }
  };

  return { handleLogin, isLoading };
};
