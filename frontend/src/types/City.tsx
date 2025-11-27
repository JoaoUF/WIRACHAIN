import type { Pagination, PaginationWrapper, Search } from "./Extras";

export type CityQueries = {
  country: number;
};

export type BaseCity = {
  id: number;
  name: string;
  code2: string;
  phone: number;
};

export type AllCityRequest = Partial<Pagination> &
  Partial<Search> &
  Partial<CityQueries>;

export type AllCityResponse = PaginationWrapper<BaseCity>;

export type CityRequest = Partial<BaseCity>;

export type CityResponse = BaseCity;
