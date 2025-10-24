import { jwtDecode } from "jwt-decode";
import type { UserPayloadInfo } from "../types/Authentication";

export function getPayloadFromJWT(token: string): UserPayloadInfo | null {
  if (!token) return null;
  try {
    return jwtDecode<UserPayloadInfo>(token);
  } catch {
    return null;
  }
}
