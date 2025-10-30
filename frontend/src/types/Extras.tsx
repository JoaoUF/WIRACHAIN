export type Pagination = {
  limit: number;
  offset: number;
};

export type Ordering = {
  ordering: string;
};

export type Search = {
  search: string;
};

export type PaginationWrapper<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};
