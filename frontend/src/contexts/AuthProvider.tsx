import React, { createContext, useCallback, useEffect, useState } from "react";
import { useGetPayloadQuery } from "../redux/api";
import type { UserPayloadInfo } from "../types/Authentication";
import { getPayloadFromJWT } from "../utils/TokenInteraction";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<{
  user: UserPayloadInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (accessToken: string) => void;
  reset: () => void;
  refetchUser: () => void;
}>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: () => {},
  reset: () => {},
  refetchUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserPayloadInfo | null>(null);

  const { data, isLoading, isError, refetch } = useGetPayloadQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    } else if (isError) {
      setUser(null);
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
    refetch();
  }, [refetch]);

  useEffect(() => {
    console.log("USER DATA", data);
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setAuth,
        reset,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
