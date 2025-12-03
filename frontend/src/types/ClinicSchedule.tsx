import type { UUID } from "crypto";
import type { Dayjs } from "dayjs";

export type ClinicSchedule = {
  id: UUID;
  clinic: UUID;
  day_of_week: number;
  open_time: Dayjs;
  close_time: Dayjs;
};
