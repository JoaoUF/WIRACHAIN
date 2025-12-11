import { createApi } from "@reduxjs/toolkit/query/react";
import type { UUID } from "crypto";
import type {
  AllClinicDoctorRequest,
  AllClinicDoctorResponse,
  ClinicDoctorResponse,
} from "../../types";
import { ENDPOINT_URL } from "../../utils/urls";
import { customBaseQuery } from "./baseQuery";

const CLINIC_DOCTOR_PATH = ENDPOINT_URL.CLINIC_DOCTOR;

export const clinicDoctorApi = createApi({
  reducerPath: "clinicDoctorApi",
  baseQuery: customBaseQuery,
  tagTypes: ["ClinicDoctor"],
  endpoints: (builder) => ({
    getAllClinicDoctors: builder.query<
      AllClinicDoctorResponse,
      AllClinicDoctorRequest
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

        return `${CLINIC_DOCTOR_PATH}/?${queryString}`;
      },
    }),

    addBulkClinicDoctor: builder.mutation<
      ClinicDoctorResponse[],
      { clinic: UUID; ids: UUID[] }
    >({
      query: (params) => ({
        url: `${CLINIC_DOCTOR_PATH}/create_bulk/`,
        method: "POST",
        body: {
          clinic: params.clinic,
          ids: params.ids,
        },
      }),
    }),

    deleteBulkClinicDoctor: builder.mutation<null, UUID[]>({
      query: (ids) => ({
        url: `${CLINIC_DOCTOR_PATH}/deactivate_bulk/`,
        method: "PUT",
        body: {
          ids: ids,
        },
      }),
    }),
  }),
});

export const {
  useGetAllClinicDoctorsQuery,
  useAddBulkClinicDoctorMutation,
  useDeleteBulkClinicDoctorMutation,
} = clinicDoctorApi;
