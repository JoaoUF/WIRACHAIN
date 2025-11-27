import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  AllCountryRequest,
  AllCountryResponse,
  CountryResponse,
} from "../../types";
import { ENDPOINT_URL } from "../../utils/urls";
import { customBaseQuery } from "./baseQuery";

const COUNTRY_PATH = ENDPOINT_URL.COUNTRY;

export const countryApi = createApi({
  reducerPath: "countryApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Country"],
  endpoints: (builder) => ({
    getAllCountries: builder.query<AllCountryResponse, AllCountryRequest>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== "" && value !== null
          )
        );
        const queryString = new URLSearchParams(
          filteredParams as Record<string, string>
        ).toString();

        return `${COUNTRY_PATH}/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              { type: "Country", id: "LIST" },
              ...result.results.map((item) => ({
                type: "Country" as const,
                id: item.id,
              })),
            ]
          : [{ type: "Country", id: "LIST" }],
    }),

    getCountry: builder.query<CountryResponse, number>({
      query: (id) => ({
        url: `${COUNTRY_PATH}/${String(id)}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Country", id }],
    }),
  }),
});

export const {
  useGetAllCountriesQuery,
  useGetCountryQuery,
  useLazyGetAllCountriesQuery,
} = countryApi;
