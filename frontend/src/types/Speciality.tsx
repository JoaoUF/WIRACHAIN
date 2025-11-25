import type { UUID } from "crypto";
import type { Pagination, PaginationWrapper, Search } from "./Extras";

export type SpecialityBasic = {
  id: UUID;
  name: string;
  description: string;
};

export type AllSpecialityRequest = Partial<Pagination> & Partial<Search>;

export type AllSpecialityResponse = PaginationWrapper<SpecialityBasic>;

export type SpecialityRequest = Partial<SpecialityBasic>;

export type SpecialityResponse = SpecialityBasic;
