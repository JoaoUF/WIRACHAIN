import type { FormInstance } from "antd";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../redux";
import { ROUTES } from "../routers/routes";
import type { LoginRequest } from "../types";
import { useAuth } from "./useAuth";

export const useLogin = (form: FormInstance<LoginRequest>) => {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (values: LoginRequest) => {
    try {
      await login(values).unwrap();
      await refetchUser();
      form.resetFields();
      navigate(ROUTES.DASHBOARD);
    } catch {
      form.setFieldValue("password", "");
    }
  };

  return { handleLogin, isLoading };
};
