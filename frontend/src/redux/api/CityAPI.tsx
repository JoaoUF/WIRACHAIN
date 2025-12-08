import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  AllCityRequest,
  AllCityResponse,
  CityResponse,
} from "../../types";
import { ENDPOINT_URL } from "../../utils/urls";
import { customBaseQuery } from "./baseQuery";

const CITY_PATH = ENDPOINT_URL.CITY;

export const cityApi = createApi({
  reducerPath: "cityApi",
  baseQuery: customBaseQuery,
  tagTypes: ["City"],
  endpoints: (builder) => ({
    getAllCities: builder.query<AllCityResponse, AllCityRequest>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== "" && value !== null
          )
        );
        const queryString = new URLSearchParams(
          filteredParams as Record<string, string>
        ).toString();

        return `${CITY_PATH}/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              { type: "City", id: "LIST" },
              ...result.results.map((item) => ({
                type: "City" as const,
                id: item.id,
              })),
            ]
          : [{ type: "City", id: "LIST" }],
    }),

    getCity: builder.query<CityResponse, number>({
      query: (id) => ({
        url: `${CITY_PATH}/${String(id)}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "City", id }],
    }),
  }),
});

export const {
  useGetAllCitiesQuery,
  useLazyGetAllCitiesQuery,
  useGetCityQuery,
} = cityApi;
