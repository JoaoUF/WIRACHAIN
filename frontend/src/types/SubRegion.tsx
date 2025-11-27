import type { Pagination, PaginationWrapper, Search } from "./Extras";

export type SubRegionQueries = {
  country: number;
};

export type BaseSubRegion = {
  id: number;
  name: string;
  code2: string;
  phone: number;
};

export type AllSubRegionRequest = Partial<Pagination> &
  Partial<Search> &
  Partial<SubRegionQueries>;

export type AllSubRegionResponse = PaginationWrapper<BaseSubRegion>;

export type SubRegionRequest = Partial<BaseSubRegion>;

export type SubRegionResponse = BaseSubRegion;
