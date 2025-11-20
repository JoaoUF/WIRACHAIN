import type { FormInstance } from "antd";
import { useNavigate } from "react-router";
import { useRegisterMutation } from "../redux";
import { ROUTES } from "../routers/routes";
import type { RegisterForm, RegisterRequest } from "../types";
import { useLocalStorageEmail } from "./useLocalStorageEmail";

export const useRegister = (form: FormInstance<RegisterForm>) => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { setRegisterEmail } = useLocalStorageEmail();

  const handleRegister = async (values: RegisterRequest) => {
    try {
      await register(values).unwrap();
      form.resetFields();
      setRegisterEmail(values.email);
      navigate(ROUTES.RESEND_EMAIL, {
        state: { email: values.email },
        replace: true,
      });
    } catch {
      form.setFieldValue("password1", "");
      form.setFieldValue("password2", "");
    }
  };

  return { handleRegister, isLoading };
};
