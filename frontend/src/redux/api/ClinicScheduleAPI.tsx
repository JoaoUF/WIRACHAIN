import { createApi } from "@reduxjs/toolkit/query/react";
import type { UUID } from "crypto";
import {
  type AllClinicScheduleRequest,
  type AllClinicScheduleResponse,
  type ClinicScheduleRequest,
  type ClinicScheduleResponse,
} from "../../types";
import { ENDPOINT_URL } from "../../utils/urls";
import { customBaseQuery } from "./baseQuery";

const CLINIC_SCHEDULE_PATH = ENDPOINT_URL.CLINIC_SCHEDULE;

export const clinicScheduleApi = createApi({
  reducerPath: "clinicScheduleApi",
  baseQuery: customBaseQuery,
  tagTypes: ["ClinicSchedule"],
  endpoints: (builder) => ({
    getAllClinicSchedules: builder.query<
      AllClinicScheduleResponse,
      AllClinicScheduleRequest
    >({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params)
            .filter(([, value]) => {
              if (value == null) return false;
              if (String(value).trim() === "") return false;
              return true;
            })
            .map(([key, value]) => [key, String(value)])
        );

        const queryString = new URLSearchParams(filteredParams).toString();

        return `${CLINIC_SCHEDULE_PATH}/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              { type: "ClinicSchedule", id: "LIST" },
              ...result.results.map((item) => ({
                type: "ClinicSchedule" as const,
                id: item.id,
              })),
            ]
          : [{ type: "ClinicSchedule", id: "LIST" }],
    }),

    getClinicSchedule: builder.query<ClinicScheduleResponse, UUID>({
      query: (id) => ({
        url: `${CLINIC_SCHEDULE_PATH}/${String(id)}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ClinicSchedule", id }],
    }),

    addClinicSchedule: builder.mutation<
      ClinicScheduleResponse,
      AllClinicScheduleRequest
    >({
      query: (data) => ({
        url: `${CLINIC_SCHEDULE_PATH}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "ClinicSchedule", id: "LIST" }],
    }),

    updateClinicSchedule: builder.mutation<
      ClinicScheduleResponse,
      ClinicScheduleRequest
    >({
      query: (data) => ({
        url: `${CLINIC_SCHEDULE_PATH}/${String(data.id)}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: "ClinicSchedule", id: data.id },
        { type: "ClinicSchedule", id: "LIST" },
      ],
    }),

    patchClinicSchedule: builder.mutation<
      ClinicScheduleResponse,
      Partial<ClinicScheduleRequest>
    >({
      query: (data) => ({
        url: `${CLINIC_SCHEDULE_PATH}/${String(data.id)}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: "ClinicSchedule", id: data.id },
        { type: "ClinicSchedule", id: "LIST" },
      ],
    }),

    deleteClinicSchedule: builder.mutation<null, UUID>({
      query: (id) => ({
        url: `${CLINIC_SCHEDULE_PATH}/${String(id)}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ClinicSchedule", id },
        { type: "ClinicSchedule", id: "LIST" },
      ],
    }),

    createBulkClinicSchedule: builder.mutation<
      AllClinicScheduleResponse,
      ClinicScheduleRequest[]
    >({
      query: (data) => ({
        url: `${CLINIC_SCHEDULE_PATH}/create_bulk/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "ClinicSchedule", id: "LIST" }],
    }),

    updateBulkClinicSchedule: builder.mutation<
      null,
      Partial<ClinicScheduleRequest>[]
    >({
      query: (data) => ({
        url: `${CLINIC_SCHEDULE_PATH}/update_bulk/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, data) => [
        ...data
          .map((item) =>
            item.id ? { type: "ClinicSchedule" as const, id: item.id } : null
          )
          .filter(Boolean),
        { type: "ClinicSchedule", id: "LIST" },
      ],
    }),

    deleteBulkClinicSchedule: builder.mutation<null, UUID[]>({
      query: (data) => ({
        url: `${CLINIC_SCHEDULE_PATH}/delete_bulk/`,
        method: "PUT",
        body: {
          ids: data,
        },
      }),
      invalidatesTags: (_result, _error, ids) => [
        ...ids.map((id) => ({
          type: "ClinicSchedule" as const,
          id: id as UUID,
        })),
        { type: "ClinicSchedule" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useAddClinicScheduleMutation,
  useCreateBulkClinicScheduleMutation,
  useDeleteBulkClinicScheduleMutation,
  useUpdateBulkClinicScheduleMutation,
  useGetAllClinicSchedulesQuery,
  useGetClinicScheduleQuery,
  useUpdateClinicScheduleMutation,
  useDeleteClinicScheduleMutation,
  usePatchClinicScheduleMutation,
} = clinicScheduleApi;
