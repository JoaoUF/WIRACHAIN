import { message } from "antd";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../redux";
import { ROUTES } from "../routers/routes";
import type { LoginRequest } from "../types";
import { useAuth } from "./useAuth";

export const useLogin = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (values: LoginRequest) => {
    try {
      // const response = await login(values).unwrap();
      // if (response.access) {
      //   setAuth(response.access);
      // }
      await login(values).unwrap();
      await refetchUser();
      message.success("Login successful!");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error("ERROR ON LOGIN", error);
      message.error("Login failed. Please check your credentials.");
    }
  };

  return { handleLogin, isLoading };
};
