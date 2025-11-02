import React, { createContext, useCallback, useEffect, useState } from "react";
import { useGetPayloadQuery } from "../redux/api";
import type { UserPayloadInfo } from "../types/Authentication";
import { getPayloadFromJWT } from "../utils/TokenInteraction";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<{
  user: UserPayloadInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authChecked: boolean;
  setAuth: (accessToken: string) => void;
  reset: () => void;
  refetchUser: () => void;
}>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authChecked: false,
  setAuth: () => {},
  reset: () => {},
  refetchUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserPayloadInfo | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const { data, isLoading, isError, refetch } = useGetPayloadQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      setAuthChecked(true);
    } else if (isError) {
      setUser(null);
      setAuthChecked(true);
    }
  }, [data, isError]);

  const setAuth = useCallback((accessToken: string) => {
    const payload = getPayloadFromJWT(accessToken);
    setUser(payload);
  }, []);

  const reset = useCallback(() => {
    setUser(null);
  }, []);

  const refetchUser = useCallback(() => {
    return refetch();
  }, [refetch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authChecked,
        setAuth,
        reset,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
