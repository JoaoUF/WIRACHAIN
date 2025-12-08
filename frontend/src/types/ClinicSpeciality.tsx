import type { UUID } from "crypto";
import type { Pagination, PaginationWrapper } from "./Extras";

export type ClinicSpecialityQueries = {
  clinic: UUID;
};

export type ClinicSpecialityBasic = {
  id: UUID;
  clinic: UUID;
  speciality: {
    id: UUID;
    name: string;
  };
};

export type AllClinicSpecialityRequest = Partial<Pagination> &
  Partial<ClinicSpecialityQueries>;

export type AllClinicSpecialityResponse =
  PaginationWrapper<ClinicSpecialityBasic>;

export type ClinicSpecialityRequest = {
  id: UUID;
  clinic: UUID;
  speciality: UUID;
};

export type ClinicSpecialityResponse = ClinicSpecialityBasic;
