import { globalMessage } from "../contexts/MessageProvider";
import { useResendEmailMutation } from "../redux";
import type { ResendEmailRequest } from "../types";

export const useResendEmail = () => {
  const [resendEmail, { isLoading }] = useResendEmailMutation();

  const handleResendEmail = async (value: string) => {
    try {
      await resendEmail({ email: value } as ResendEmailRequest).unwrap();
      globalMessage.success("Confirmation email resent.");
    } catch (error) {
      console.error("ERROR ON LOGIN", error);
      globalMessage.error({
        content: `Register filed: ${error}`,
        duration: 1.5,
      });
    }
  };

  return { handleResendEmail, isLoading };
};
