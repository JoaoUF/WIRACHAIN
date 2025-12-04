import type { UUID } from "crypto";
import type { Dayjs } from "dayjs";
import type { Pagination, PaginationWrapper } from "./Extras";

export type ClinicScheduleQueries = {
  clinic: UUID;
};

export type ClinicScheduleBasic = {
  id: UUID;
  clinic: UUID;
  day_of_week: number;
  open_time: Dayjs;
  close_time: Dayjs;
};

export type AllClinicScheduleRequest = Partial<Pagination> &
  Partial<ClinicScheduleQueries>;

export type AllClinicScheduleResponse = PaginationWrapper<ClinicScheduleBasic>;

export type ClinicScheduleRequest = Partial<ClinicScheduleBasic>;

export type ClinicScheduleResponse = ClinicScheduleBasic;
