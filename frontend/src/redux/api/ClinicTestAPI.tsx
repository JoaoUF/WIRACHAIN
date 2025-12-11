import { createApi } from "@reduxjs/toolkit/query/react";
import type { UUID } from "crypto";
import type {
  AllClinicTestReponse,
  AllClinicTestRequest,
  ClinicTestResponse,
} from "../../types";
import { ENDPOINT_URL } from "../../utils/urls";
import { customBaseQuery } from "./baseQuery";

const CLINIC_TEST_PATH = ENDPOINT_URL.CLINIC_TEST;

export const clinicTestApi = createApi({
  reducerPath: "clinicTestApi",
  baseQuery: customBaseQuery,
  tagTypes: ["ClinicTest"],
  endpoints: (builder) => ({
    getAllClinicTests: builder.query<
      AllClinicTestReponse,
      AllClinicTestRequest
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

        return `${CLINIC_TEST_PATH}/?${queryString}`;
      },
    }),

    addBulkClinicTest: builder.mutation<
      ClinicTestResponse[],
      { clinic: UUID; ids: UUID[] }
    >({
      query: (params) => ({
        url: `${CLINIC_TEST_PATH}/create_bulk/`,
        method: "POST",
        body: {
          clinic: params.clinic,
          ids: params.ids,
        },
      }),
    }),

    deleteBulkClinicTest: builder.mutation<null, UUID[]>({
      query: (ids) => ({
        url: `${CLINIC_TEST_PATH}/deactivate_bulk/`,
        method: "PUT",
        body: {
          ids: ids,
        },
      }),
    }),
  }),
});

export const {
  useGetAllClinicTestsQuery,
  useAddBulkClinicTestMutation,
  useDeleteBulkClinicTestMutation,
} = clinicTestApi;
