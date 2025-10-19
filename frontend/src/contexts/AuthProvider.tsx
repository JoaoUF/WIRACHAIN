import React, { createContext, useEffect, useState } from "react";
import type { UserPayloadInfo } from "../types/Authentication";
import { getUserFromJWT } from "../utils/cookies";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<{
  user: UserPayloadInfo | null;
  isAuthenticated: boolean;
  reloadUser: () => void;
}>({
  user: null,
  isAuthenticated: false,
  reloadUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserPayloadInfo | null>(getUserFromJWT());
  const reloadUser = () => setUser(getUserFromJWT());

  useEffect(() => {
    setUser(getUserFromJWT());
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        reloadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
