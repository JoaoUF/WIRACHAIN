import { useLogoutMutation } from "../redux";
import { useAuth } from "./useAuth";

export const useLogout = () => {
  const [logout] = useLogoutMutation();
  const { reset } = useAuth();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      reset();
    } catch (error) {
      console.error("ERROR ON LOGOUT", error);
    }
  };

  return { handleLogout };
};
