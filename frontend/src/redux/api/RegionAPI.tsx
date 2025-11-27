import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  AllRegionRequest,
  AllRegionResponse,
  RegionResponse,
} from "../../types";
import { ENDPOINT_URL } from "../../utils/urls";
import { customBaseQuery } from "./baseQuery";

const REGION_PATH = ENDPOINT_URL.REGION;

export const regionApi = createApi({
  reducerPath: "regionApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Region"],
  endpoints: (builder) => ({
    getAllRegions: builder.query<AllRegionResponse, AllRegionRequest>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== "" && value !== null
          )
        );
        const queryString = new URLSearchParams(
          filteredParams as Record<string, string>
        ).toString();

        return `${REGION_PATH}/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              { type: "Region", id: "LIST" },
              ...result.results.map((item) => ({
                type: "Region" as const,
                id: item.id,
              })),
            ]
          : [{ type: "Region", id: "LIST" }],
    }),

    getRegion: builder.query<RegionResponse, number>({
      query: (id) => ({
        url: `${REGION_PATH}/${String(id)}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Region", id }],
    }),
  }),
});

export const { useGetAllRegionsQuery, useGetRegionQuery } = regionApi;
