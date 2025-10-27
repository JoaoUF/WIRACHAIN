import type {
  Active,
  Ordering,
  Pagination,
  PaginationWrapper,
  Search,
} from "./Extras";

export type UserQueries = {
  document_type: string;
  email: string;
  gender: string;
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

export type AllUsersRequest = UserQueries &
  Pagination &
  Ordering &
  Search &
  Active;

export type AllUsersResponse = PaginationWrapper<UserBasic>;

export type UserRequest = UserBasic;

export type UserResponse = UserBasic;
