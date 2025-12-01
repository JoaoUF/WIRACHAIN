import { createApi } from "@reduxjs/toolkit/query/react";
import type { UUID } from "crypto";
import type {
  AllCityRequest,
  AllClinicResponse,
  ClinicRequest,
  ClinicResponse,
} from "../../types";
import { ENDPOINT_URL } from "../../utils/urls";
import { customBaseQuery } from "./baseQuery";

const CLINIC_PATH = ENDPOINT_URL.CLINIC;

export const clinicApi = createApi({
  reducerPath: "clinicApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Clinic"],
  endpoints: (builder) => ({
    getAllClinics: builder.query<AllClinicResponse, AllCityRequest>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== "" && value !== null
          )
        );
        const queryString = new URLSearchParams(
          filteredParams as Record<string, string>
        ).toString();

        return `${CLINIC_PATH}/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              { type: "Clinic", id: "LIST" },
              ...result.results.map((item) => ({
                type: "Clinic" as const,
                id: item.id,
              })),
            ]
          : [{ type: "Clinic", id: "LIST" }],
    }),

    getClinic: builder.query<ClinicResponse, UUID>({
      query: (id) => ({
        url: `${CLINIC_PATH}/${String(id)}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Clinic", id }],
    }),

    addClinic: builder.mutation<ClinicResponse, ClinicRequest>({
      query: (data) => ({
        url: `${CLINIC_PATH}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Clinic", id: "LIST" }],
    }),

    updateClinic: builder.mutation<ClinicResponse, ClinicRequest>({
      query: (data) => ({
        url: `${CLINIC_PATH}/${String(data.id)}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: "Clinic", id: data.id },
        { type: "Clinic", id: "LIST" },
      ],
    }),

    pathClinic: builder.mutation<ClinicResponse, Partial<ClinicRequest>>({
      query: (data) => ({
        url: `${CLINIC_PATH}/${String(data.id)}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: "Clinic", id: data.id },
        { type: "Clinic", id: "LIST" },
      ],
    }),

    updateBulkClinic: builder.mutation<null, { list_ids: UUID[] }>({
      query: (params) => ({
        url: `${CLINIC_PATH}/update_bulk/`,
        method: "PUT",
        body: {
          ids: params.list_ids,
        },
      }),
      invalidatesTags: (_result, _error, params) => [
        ...params.list_ids.map((id) => ({ type: "Clinic" as const, id })),
        { type: "Clinic" as const, id: "LIST" },
      ],
    }),

    deleteClinic: builder.mutation<null, UUID>({
      query: (id) => ({
        url: `${CLINIC_PATH}/${String(id)}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Clinic", id },
        { type: "Clinic", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllClinicsQuery,
  useGetClinicQuery,
  useAddClinicMutation,
  useUpdateBulkClinicMutation,
  useUpdateClinicMutation,
  useDeleteClinicMutation,
  usePathClinicMutation,
} = clinicApi;
