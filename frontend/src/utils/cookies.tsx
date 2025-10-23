import { jwtDecode } from "jwt-decode";
import type { UserPayloadInfo } from "../types/Authentication";

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift()!;
  return null;
}

export function getUserFromJWT(): UserPayloadInfo | null {
  const token = getCookie("access-token");
  console.log("GET COOKIES IS DONE:", token);

  if (!token) return null;
  try {
    console.log("THIS IS THE PAYLOAD INFO:", jwtDecode<UserPayloadInfo>(token));
    return jwtDecode<UserPayloadInfo>(token);
  } catch {
    return null;
  }
}
