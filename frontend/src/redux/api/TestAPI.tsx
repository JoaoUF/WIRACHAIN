import { createApi } from "@reduxjs/toolkit/query/react";
import type { UUID } from "crypto";
import type {
  AllTestRequest,
  AllTestResponse,
  TestRequest,
  TestResponse,
} from "../../types";
import { ENDPOINT_URL } from "../../utils/urls";
import { customBaseQuery } from "./baseQuery";

const TEST_PATH = ENDPOINT_URL.TEST;

export const testApi = createApi({
  reducerPath: "testApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Test"],
  endpoints: (builder) => ({
    getAllTests: builder.query<AllTestResponse, AllTestRequest>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== "" && value !== null
          )
        );
        const queryString = new URLSearchParams(
          filteredParams as Record<string, string>
        ).toString();

        return `${TEST_PATH}/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              { type: "Test", id: "LIST" },
              ...result.results.map((item) => ({
                type: "Test" as const,
                id: item.id,
              })),
            ]
          : [{ type: "Test", id: "LIST" }],
    }),

    getTest: builder.query<TestResponse, UUID>({
      query: (id) => ({
        url: `${TEST_PATH}/${String(id)}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Test", id }],
    }),

    addTest: builder.mutation<TestResponse, TestRequest>({
      query: (data) => ({
        url: `${TEST_PATH}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Test", id: "LIST" }],
    }),

    updateTest: builder.mutation<TestResponse, TestRequest>({
      query: (data) => ({
        url: `${TEST_PATH}/${String(data.id)}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: "Test", id: data.id },
        { type: "Test", id: "LIST" },
      ],
    }),

    patchTest: builder.mutation<TestResponse, Partial<TestRequest>>({
      query: (data) => ({
        url: `${TEST_PATH}/${String(data.id)}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: "Test", id: data.id },
        { type: "Test", id: "LIST" },
      ],
    }),

    updateBulkTest: builder.mutation<null, { list_ids: UUID[] }>({
      query: (params) => ({
        url: `${TEST_PATH}/update_bulk/`,
        method: "PUT",
        body: {
          ids: params.list_ids,
        },
      }),
      invalidatesTags: (_result, _error, params) => [
        ...params.list_ids.map((id) => ({ type: "Test" as const, id })),
        { type: "Test" as const, id: "LIST" },
      ],
    }),

    deleteTest: builder.mutation<null, UUID>({
      query: (id) => ({
        url: `${TEST_PATH}/${String(id)}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Test", id },
        { type: "Test", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllTestsQuery,
  useGetTestQuery,
  useAddTestMutation,
  useUpdateTestMutation,
  usePatchTestMutation,
  useUpdateBulkTestMutation,
  useDeleteTestMutation,
} = testApi;
