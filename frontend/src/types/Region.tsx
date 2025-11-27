import type { Pagination, PaginationWrapper, Search } from "./Extras";

export type RegionQueries = {
  country: number;
};

export type BaseRegion = {
  id: number;
  name: string;
  code2: string;
  phone: number;
};

export type AllRegionRequest = Partial<Pagination> &
  Partial<Search> &
  Partial<RegionQueries>;

export type AllRegionResponse = PaginationWrapper<BaseRegion>;

export type RegionRequest = Partial<BaseRegion>;

export type RegionResponse = BaseRegion;
