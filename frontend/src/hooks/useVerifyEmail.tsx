import { useNavigate } from "react-router";
import { globalMessage } from "../contexts/MessageProvider";
import { useVerifyEmailMutation } from "../redux";
import { ROUTES } from "../routers/routes";
import type { verifyEmailRequest } from "../types";

export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const [verifyEmail, { isLoading, isError }] = useVerifyEmailMutation();

  const handleVerifyEmail = async (values: verifyEmailRequest) => {
    try {
      await verifyEmail(values).unwrap();
      navigate(ROUTES.ROOT);
    } catch (error) {
      globalMessage.error({
        content: `Verify email failed: ${error}`,
        duration: 1.5,
      });
    }
  };

  return { handleVerifyEmail, isLoading, isError };
};
