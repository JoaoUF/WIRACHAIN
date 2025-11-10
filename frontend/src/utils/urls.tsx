export const API_URL = import.meta.env.VITE_API_URL as string;

export const ENDPOINT_URL = {
  CLINIC: "clinics",
  USER: "users",
  DISEASE: "diseases",
  TEST: "tests",
  SPECIALITY: "specialities",
} as const;

export type ModelKey = keyof typeof ENDPOINT_URL;
