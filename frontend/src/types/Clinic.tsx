import type { UUID } from "crypto";
import type { Pagination, PaginationWrapper, Search } from "./Extras";

export type ClinicQueries = {
  country: number;
  region: number;
  city: number;
};

export type ClinicBasic = {
  id: UUID;
  email: string;
  website_url: string;
  phone: string;
  address: string;
  enterprise_user: number;
};

export type ClinicResponse = ClinicBasic & {
  country: {
    id: number;
    name: string;
  };
  region: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
};

export type ClinicRequest = Partial<ClinicBasic> & {
  country: number;
  region: number;
  city: number;
};

export type AllClinicRequest = Partial<Pagination> &
  Partial<Search> &
  Partial<ClinicQueries>;

export type AllClinicResponse = PaginationWrapper<ClinicResponse>;

export type ClinicForm = Partial<ClinicRequest> & {
  country_code: string;
};
