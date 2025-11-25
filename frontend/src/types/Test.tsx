import type { UUID } from "crypto";
import type { Pagination, PaginationWrapper, Search } from "./Extras";

export type TestBasic = {
  id: UUID;
  name: string;
  description: string;
};

export type AllTestRequest = Partial<Pagination> & Partial<Search>;

export type AllTestResponse = PaginationWrapper<TestBasic>;

export type TestRequest = Partial<TestBasic>;

export type TestResponse = TestBasic;
