import type { UUID } from "crypto";
import type { Ordering, Pagination, PaginationWrapper, Search } from "./Extras";

export type DiseaseQueries = {
  enterprise_user: number;
  is_active: boolean;
};

export type DiseaseBasic = {
  id?: UUID;
  name: string;
  description: string;
  enterprise_user: number;
};

export type AllDiseasesRequest = Partial<DiseaseQueries> &
  Partial<Pagination> &
  Partial<Ordering> &
  Partial<Search>;

export type AllDiseasesResponse = PaginationWrapper<DiseaseBasic>;

export type DiseaseRequest = DiseaseBasic;

export type DiseaseResponse = DiseaseBasic;
