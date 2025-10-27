import { createApi } from "@reduxjs/toolkit/query/react";
import {
  type LoginRequest,
  type LoginResponse,
  type UserPayloadInfo,
} from "../../types";
import { customBaseQuery } from "./baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout/",
        method: "POST",
      }),
    }),
    getPayload: builder.query<UserPayloadInfo, void>({
      query: () => ({
        url: "/me/",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetPayloadQuery } =
  authApi;
