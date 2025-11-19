import type { FormInstance } from "antd";
import { useNavigate } from "react-router";
import { globalMessage } from "../contexts/MessageProvider";
import { useRegisterMutation } from "../redux";
import { ROUTES } from "../routers/routes";
import type { RegisterRequest } from "../types";
import { useLocalStorageEmail } from "./useLocalStorageEmail";

export const useRegister = (form: FormInstance<RegisterRequest>) => {
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
    } catch (error) {
      console.error("ERROR ON LOGIN", error);
      form.setFieldValue("password1", "");
      form.setFieldValue("password2", "");
      globalMessage.error({
        content: `Register filed: ${error}`,
        duration: 1.5,
      });
    }
  };

  return { handleRegister, isLoading };
};
