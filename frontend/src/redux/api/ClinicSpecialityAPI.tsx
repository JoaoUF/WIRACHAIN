import { createApi } from "@reduxjs/toolkit/query/react";
import type { UUID } from "crypto";
import type {
  AllClinicSpecialityRequest,
  AllClinicSpecialityResponse,
  ClinicSpecialityResponse,
} from "../../types/";
import { ENDPOINT_URL } from "../../utils/urls";
import { customBaseQuery } from "./baseQuery";

const CLINIC_SPECIALITY_PATH = ENDPOINT_URL.CLINIC_SPECIALITY;

export const clinicSpecialityApi = createApi({
  reducerPath: "clinicSpecialityApi",
  baseQuery: customBaseQuery,
  tagTypes: ["ClinicSpeciality"],
  endpoints: (builder) => ({
    getAllClinicSpecialities: builder.query<
      AllClinicSpecialityResponse,
      AllClinicSpecialityRequest
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

        return `${CLINIC_SPECIALITY_PATH}/?${queryString}`;
      },
    }),

    addBulkClinicSpecialities: builder.mutation<
      ClinicSpecialityResponse[],
      UUID[]
    >({
      query: (data) => ({
        url: `${CLINIC_SPECIALITY_PATH}/create_bulk/`,
        method: "POST",
        body: data,
      }),
    }),

    deleteBulkClinicSpecialities: builder.mutation<null, UUID[]>({
      query: (ids) => ({
        url: `${CLINIC_SPECIALITY_PATH}/deactivate_bulk/`,
        method: "PUT",
        body: {
          ids: ids,
        },
      }),
    }),
  }),
});

export const {
  useGetAllClinicSpecialitiesQuery,
  useAddBulkClinicSpecialitiesMutation,
  useDeleteBulkClinicSpecialitiesMutation,
} = clinicSpecialityApi;
