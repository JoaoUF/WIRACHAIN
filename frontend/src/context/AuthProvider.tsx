import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState } from "react";
import { useLoginMutation, useLogoutMutation } from "../redux";
import type { UserPayloadInfo } from "../types/Authentication";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift()!;
  return null;
}

function getUserFromJWT(): UserPayloadInfo | null {
  const token = getCookie("access-token");
  if (!token) return null;
  try {
    return jwtDecode<UserPayloadInfo>(token);
  } catch {
    return null;
  }
}

type AuthContextType = {
  user: UserPayloadInfo | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => void;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  reloadUser: () => {},
  loading: false,
  error: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserPayloadInfo | null>(getUserFromJWT());
  const [loginApi, { isLoading: isLoggingIn, error: loginError }] =
    useLoginMutation();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const reloadUser = () => setUser(getUserFromJWT());

  const login = async (email: string, password: string) => {
    await loginApi({ email, password }).unwrap();
    reloadUser();
  };

  const logout = async () => {
    await logoutApi().unwrap();
    document.cookie = "access-token=; Max-Age=0; path=/";
    document.cookie = "refresh-token=; Max-Age=0; path=/";
    reloadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        reloadUser,
        loading: isLoggingIn || isLoggingOut,
        error: (loginError as any)?.data?.detail || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
