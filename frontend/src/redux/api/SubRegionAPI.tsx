import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  AllSubRegionRequest,
  AllSubRegionResponse,
  SubRegionResponse,
} from "../../types";
import { ENDPOINT_URL } from "../../utils/urls";
import { customBaseQuery } from "./baseQuery";

const SUB_REGION_PATH = ENDPOINT_URL.SUBREGION;

export const subRegionApi = createApi({
  reducerPath: "subRegionApi",
  baseQuery: customBaseQuery,
  tagTypes: ["SubRegion"],
  endpoints: (builder) => ({
    getAllSubRegion: builder.query<AllSubRegionResponse, AllSubRegionRequest>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== "" && value !== null
          )
        );
        const queryString = new URLSearchParams(
          filteredParams as Record<string, string>
        ).toString();

        return `${SUB_REGION_PATH}/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              { type: "SubRegion", id: "LIST" },
              ...result.results.map((item) => ({
                type: "SubRegion" as const,
                id: item.id,
              })),
            ]
          : [{ type: "SubRegion", id: "LIST" }],
    }),

    getSubRegion: builder.query<SubRegionResponse, number>({
      query: (id) => ({
        url: `${SUB_REGION_PATH}/${String(id)}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "SubRegion", id }],
    }),
  }),
});

export const {
  useGetAllSubRegionQuery,
  useLazyGetAllSubRegionQuery,
  useGetSubRegionQuery,
} = subRegionApi;
