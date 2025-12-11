import type { UUID } from "crypto";
import type { Pagination, PaginationWrapper } from "./Extras";

export type ClinicDoctorQueries = {
  clinic: UUID;
};

export type ClinicDoctorBasic = {
  id: UUID;
  clinic: UUID;
  doctor_user: {
    id: UUID;
    name: string;
  };
};

export type AllClinicDoctorRequest = Partial<Pagination> &
  Partial<ClinicDoctorQueries>;

export type AllClinicDoctorResponse = PaginationWrapper<ClinicDoctorBasic>;

export type ClinicDoctorRequest = {
  id: UUID;
  clinic: UUID;
  doctor_user: UUID;
};

export type ClinicDoctorResponse = ClinicDoctorBasic;
