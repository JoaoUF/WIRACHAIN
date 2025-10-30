import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UUID } from "crypto";
import type {
  AllDiseasesRequest,
  AllDiseasesResponse,
  DiseaseRequest,
  DiseaseResponse,
} from "../../types";
import { API_URL, ENDPOINT_URL } from "../../utils/urls";

const DISEASE_PATH = ENDPOINT_URL.DISEASE;

export const diseaseApi = createApi({
  reducerPath: "diseaseApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
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
      providesTags: ["Disease"],
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
      invalidatesTags: ["Disease"],
    }),

    updateDisease: builder.mutation<DiseaseResponse, DiseaseRequest>({
      query: (data) => ({
        url: `${DISEASE_PATH}/${String(data.id)}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (__result, __error, data) => [
        { type: "Disease", id: data.id },
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
      ],
    }),

    deleteDisease: builder.mutation<null, number>({
      query: (disease_id) => ({
        url: `${DISEASE_PATH}/${String(disease_id)}/`,
        method: "DELETE",
      }),
      invalidatesTags: (__result, __error, id) => [{ type: "Disease", id }],
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
} = diseaseApi;
