import type { Pagination, PaginationWrapper, Search } from "./Extras";

export type UserQueries = {
  gender: string;
  is_active: boolean;
};

export type UserBasic = {
  id: number;
  groups: number[];
  user_permissions: number[];
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  phone: string;
  birth_date: string;
  document_type: string;
  document_value: string;
  is_active: boolean;
  enterprise: number;
};

export type AllUsersRequest = Partial<UserQueries> &
  Partial<Pagination> &
  Partial<Search>;

export type AllUsersResponse = PaginationWrapper<UserBasic>;

export type UserRequest = Partial<UserBasic>;

export type UserResponse = UserBasic;
