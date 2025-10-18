export interface UserPayloadInfo {
  email: string;
  role: string;
  document_value: string;
  enterprise: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: unknown;
  access: string;
  refresh: string | null;
  access_expiration: string;
  refresh_expiration: string;
}
