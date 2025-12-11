export const API_URL = import.meta.env.VITE_API_URL as string;

export const ENDPOINT_URL = {
  CLINIC: "clinics",
  CLINIC_SCHEDULE: "clinic-schedule",
  USER: "users",
  DISEASE: "diseases",
  TEST: "tests",
  SPECIALITY: "specialities",
  COUNTRY: "countries",
  REGION: "regions",
  SUBREGION: "subregions",
  CITY: "cities",
  CLINIC_SPECIALITY: "clinic-specialities",
  CLINIC_TEST: "clinic-tests",
  CLINIC_DOCTOR: "clinic-doctors",
} as const;

export type ModelKey = keyof typeof ENDPOINT_URL;
