import type { UUID } from "crypto";
import type { Pagination, PaginationWrapper, Search } from "./Extras";

export type DiseaseQueries = {
  enterprise_user: number;
};

export type DiseaseBasic = {
  id: UUID;
  name: string;
  description: string;
};

export type AllDiseasesRequest = Partial<DiseaseQueries> &
  Partial<Pagination> &
  Partial<Search>;

export type AllDiseasesResponse = PaginationWrapper<DiseaseBasic>;

export type DiseaseRequest = Partial<DiseaseBasic>;

export type DiseaseResponse = DiseaseBasic;
