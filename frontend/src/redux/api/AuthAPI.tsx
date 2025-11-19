import { createApi } from "@reduxjs/toolkit/query/react";
import {
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type ResendEmailRequest,
  type UserPayloadInfo,
  type verifyEmailRequest,
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
    register: builder.mutation<void, RegisterRequest>({
      query: (data) => ({
        url: "/register/",
        method: "POST",
        body: data,
      }),
    }),
    resendEmail: builder.mutation<void, ResendEmailRequest>({
      query: (data) => ({
        url: "/resend-email/",
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation<void, verifyEmailRequest>({
      query: (data) => ({
        url: "/verify-email/",
        method: "POST",
        body: data,
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

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useResendEmailMutation,
  useGetPayloadQuery,
  useVerifyEmailMutation,
} = authApi;
