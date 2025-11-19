import type { Dayjs } from "dayjs";

export const USER_TYPES = {
  ADMIN: "ADMIN",
  ENTERPRISE_BASIC: "ENTERPRISE_BASIC",
  ENTERPRISE_PREMIUM: "ENTERPRISE_PREMIUM",
  ENTERPRISE_PROFESSIONAL: "ENTERPRISE_PROFESSIONAL",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

interface BasicUserInfo {
  pk: number;
  email: string;
  first_name: string;
  last_nmae: string;
}

export interface UserPayloadInfo {
  user_id: number;
  email: string;
  document_value: string;
  groups: UserType;
  enterprise_id: number | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: BasicUserInfo;
  access_expiration: string;
  refresh_expiration: string;
}

export interface RegisterRequest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  phone: string;
  country_code: string;
  birth_date: Dayjs;
  document_type: string;
  document_value: string;
  password1: string;
  password2: string;
}

export interface ResendEmailRequest {
  email: string;
}
