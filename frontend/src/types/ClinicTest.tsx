import type { UUID } from "crypto";
import type { Pagination, PaginationWrapper } from "./Extras";

export type ClinicTestQueries = {
  clinic: UUID;
};

export type ClinicTestBasic = {
  id: UUID;
  clinic: UUID;
  test: {
    id: UUID;
    name: string;
  };
};

export type AllClinicTestRequest = Partial<Pagination> &
  Partial<ClinicTestQueries>;

export type AllClinicTestReponse = PaginationWrapper<ClinicTestBasic>;

export type ClinicTestRequest = {
  id: UUID;
  clinic: UUID;
  test: UUID;
};

export type ClinicTestResponse = ClinicTestBasic;
