import type { Dayjs } from "dayjs";
import type {
  RegisterForm,
  RegisterRequest,
  UserForm,
  UserRequest,
} from "../types";

/**
 * Convert form values (Dayjs, loose phone input) into API DTO.
 * Keep all formatting logic here so it's easy to test and modify.
 */
export function toRegisterDTO(values: RegisterForm): RegisterRequest {
  // birth_date might be Dayjs or string; handle both defensively
  const bd = values.birth_date as Dayjs | string | undefined;
  const birth_date =
    bd && typeof (bd as Dayjs).format === "function"
      ? (bd as Dayjs).format("YYYY-MM-DD")
      : String(bd ?? "");

  // normalize phone: remove non-digits, then prefix with country code
  const phoneDigits = String(values.phone ?? "").replace(/\D+/g, "");
  const country = values.country_code?.replace(/\D+/g, "") ?? "";
  const phone = country ? `+${country} ${phoneDigits}` : phoneDigits;

  return {
    first_name: values.first_name,
    last_name: values.last_name,
    email: values.email,
    gender: values.gender,
    phone,
    country_code: values.country_code,
    birth_date,
    document_type: values.document_type,
    document_value: values.document_value,
    password1: values.password1,
    password2: values.password2,
  };
}

export function toCustomUserDTO(values: UserForm): UserRequest {
  const bd = values.birth_date as Dayjs | string | undefined;
  const birth_date =
    bd && typeof (bd as Dayjs).format === "function"
      ? (bd as Dayjs).format("YYYY-MM-DD")
      : String(bd ?? "");

  // normalize phone: remove non-digits, then prefix with country code
  const phoneDigits = String(values.phone ?? "").replace(/\D+/g, "");
  const country = values.country_code?.replace(/\D+/g, "") ?? "";
  const phone = country ? `+${country} ${phoneDigits}` : phoneDigits;

  return {
    first_name: values.first_name,
    last_name: values.last_name,
    email: values.email,
    gender: values.gender,
    phone,
    birth_date,
    document_type: values.document_type,
    document_value: values.document_value,
  };
}
