import React, { createContext, useCallback, useState } from "react";
import type { UserPayloadInfo } from "../types/Authentication";
import { getPayloadFromJWT } from "../utils/TokenInteraction";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<{
  user: UserPayloadInfo | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string) => void;
  reset: () => void;
}>({
  user: null,
  isAuthenticated: false,
  setAuth: () => {},
  reset: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserPayloadInfo | null>(null);

  const setAuth = useCallback((accessToken: string) => {
    const payload = getPayloadFromJWT(accessToken);
    setUser(payload);
  }, []);

  const reset = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setAuth,
        reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
