import { useLogoutMutation } from "../redux";
import { useAuth } from "./useAuth";

export const useLogout = () => {
  const [logout] = useLogoutMutation();
  const { reloadUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      reloadUser();
    } catch (error) {
      console.error("ERROR ON LOGOUT", error);
    }
  };

  return { handleLogout };
};
