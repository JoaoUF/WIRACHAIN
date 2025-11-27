import type { Pagination, PaginationWrapper, Search } from "./Extras";

export type BaseCountry = {
  id: number;
  name: string;
  code2: string;
  phone: number;
};

export type AllCountryRequest = Partial<Pagination> & Partial<Search>;

export type AllCountryResponse = PaginationWrapper<BaseCountry>;

export type CountryRequest = Partial<BaseCountry>;

export type CountryResponse = BaseCountry;
