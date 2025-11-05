import { createApi } from "@reduxjs/toolkit/query/react";
import type { UUID } from "crypto";
import type {
  AllDiseasesRequest,
  AllDiseasesResponse,
  DiseaseRequest,
  DiseaseResponse,
} from "../../types";
import { ENDPOINT_URL } from "../../utils/urls";
import { customBaseQuery } from "./baseQuery";

const DISEASE_PATH = ENDPOINT_URL.DISEASE;

export const diseaseApi = createApi({
  reducerPath: "diseaseApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Disease"],
  endpoints: (builder) => ({
    getAllDiseases: builder.query<AllDiseasesResponse, AllDiseasesRequest>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== "" && value !== null
          )
        );
        const queryString = new URLSearchParams(
          filteredParams as Record<string, string>
        ).toString();

        return `${DISEASE_PATH}/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              { type: "Disease", id: "LIST" },
              ...result.results.map((disease) => ({
                type: "Disease" as const,
                id: disease.id,
              })),
            ]
          : [{ type: "Disease", id: "LIST" }],
    }),

    getDisease: builder.query<DiseaseResponse, UUID>({
      query: (id_disease) => ({
        url: `${DISEASE_PATH}/${String(id_disease)}/`,
        method: "GET",
      }),
      providesTags: (__result, __error, id) => [{ type: "Disease", id }],
    }),

    addDisease: builder.mutation<DiseaseResponse, DiseaseRequest>({
      query: (data) => ({
        url: `${DISEASE_PATH}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Disease", id: "LIST" }],
    }),

    updateDisease: builder.mutation<DiseaseResponse, DiseaseRequest>({
      query: (data) => ({
        url: `${DISEASE_PATH}/${String(data.id)}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (__result, __error, data) => [
        { type: "Disease", id: data.id },
        { type: "Disease", id: "LIST" },
      ],
    }),

    patchDisease: builder.mutation<DiseaseResponse, Partial<DiseaseRequest>>({
      query: (data) => ({
        url: `${DISEASE_PATH}/${String(data.id)}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (__result, __error, data) => [
        { type: "Disease", id: data.id },
        { type: "Disease", id: "LIST" },
      ],
    }),

    deleteBulkDisease: builder.mutation<null, UUID[]>({
      query: (list_disease_id) => ({
        url: `${DISEASE_PATH}/delete_bulk/`,
        method: "DELETE",
        body: {
          ids: list_disease_id,
        },
      }),
      invalidatesTags: (_result, _error, list_disease_id) => [
        ...list_disease_id.map((id) => ({ type: "Disease" as const, id })),
        { type: "Disease" as const, id: "LIST" },
      ],
    }),

    deleteDisease: builder.mutation<null, UUID>({
      query: (disease_id) => ({
        url: `${DISEASE_PATH}/${String(disease_id)}/`,
        method: "DELETE",
      }),
      invalidatesTags: (__result, __error, id) => [
        { type: "Disease", id },
        { type: "Disease", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllDiseasesQuery,
  useGetDiseaseQuery,
  useAddDiseaseMutation,
  useUpdateDiseaseMutation,
  useDeleteDiseaseMutation,
  usePatchDiseaseMutation,
  useDeleteBulkDiseaseMutation,
} = diseaseApi;
