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
  email: string;
  role: UserType;
  document_value: string;
  enterprise: string;
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
