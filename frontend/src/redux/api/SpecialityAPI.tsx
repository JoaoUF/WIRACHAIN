import { createApi } from "@reduxjs/toolkit/query/react";
import type { UUID } from "crypto";
import type {
  AllSpecialityRequest,
  AllSpecialityResponse,
  SpecialityRequest,
  SpecialityResponse,
} from "../../types";
import { ENDPOINT_URL } from "../../utils/urls";
import { customBaseQuery } from "./baseQuery";

const SPECIALITY_PATH = ENDPOINT_URL.SPECIALITY;

export const specialityApi = createApi({
  reducerPath: "specialityApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Speciality"],
  endpoints: (builder) => ({
    getAllSpecialities: builder.query<
      AllSpecialityResponse,
      AllSpecialityRequest
    >({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== "" && value !== null
          )
        );
        const queryString = new URLSearchParams(
          filteredParams as Record<string, string>
        ).toString();

        return `${SPECIALITY_PATH}/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              { type: "Speciality", id: "LIST" },
              ...result.results.map((item) => ({
                type: "Speciality" as const,
                id: item.id,
              })),
            ]
          : [{ type: "Speciality", id: "LIST" }],
    }),

    getSpeciality: builder.query<SpecialityResponse, UUID>({
      query: (id) => ({
        url: `${SPECIALITY_PATH}/${String(id)}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Speciality", id }],
    }),

    addSpeciality: builder.mutation<SpecialityResponse, SpecialityRequest>({
      query: (data) => ({
        url: `${SPECIALITY_PATH}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Speciality", id: "LIST" }],
    }),

    updateSpeciality: builder.mutation<SpecialityResponse, SpecialityRequest>({
      query: (data) => ({
        url: `${SPECIALITY_PATH}/${String(data.id)}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: "Speciality", id: data.id },
        { type: "Speciality", id: "LIST" },
      ],
    }),

    patchSpeciality: builder.mutation<
      SpecialityResponse,
      Partial<SpecialityRequest>
    >({
      query: (data) => ({
        url: `${SPECIALITY_PATH}/${String(data.id)}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: "Speciality", id: data.id },
        { type: "Speciality", id: "LIST" },
      ],
    }),

    updateBulkSpeciality: builder.mutation<null, { list_ids: UUID[] }>({
      query: (params) => ({
        url: `${SPECIALITY_PATH}/update_bulk/`,
        method: "PUT",
        body: {
          ids: params.list_ids,
        },
      }),
      invalidatesTags: (_result, _error, params) => [
        ...params.list_ids.map((id) => ({ type: "Speciality" as const, id })),
        { type: "Speciality" as const, id: "LIST" },
      ],
    }),

    deleteSpeciality: builder.mutation<null, UUID>({
      query: (id) => ({
        url: `${SPECIALITY_PATH}/${String(id)}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Speciality", id },
        { type: "Speciality", id: "LIST" },
      ],
    }),

    getAllSpecialitiesPerClinic: builder.query<
      AllSpecialityResponse,
      AllSpecialityRequest
    >({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== "" && value !== null
          )
        );
        const queryString = new URLSearchParams(
          filteredParams as Record<string, string>
        ).toString();

        return `${SPECIALITY_PATH}/available_for_clinic/?${queryString}`;
      },
    }),
  }),
});

export const {
  useGetAllSpecialitiesQuery,
  useGetSpecialityQuery,
  useAddSpecialityMutation,
  useUpdateSpecialityMutation,
  usePatchSpecialityMutation,
  useUpdateBulkSpecialityMutation,
  useDeleteSpecialityMutation,
  useGetAllSpecialitiesPerClinicQuery,
} = specialityApi;
