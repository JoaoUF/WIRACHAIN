import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  type AllUsersRequest,
  type UserRequest,
  type UserResponse,
} from "../../types";
import { API_URL, ENDPOINT_URL } from "../../utils/urls";

const USER_PATH = ENDPOINT_URL.USER;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["User"],

  endpoints: (builder) => ({
    getAllUsers: builder.query<AllUsersRequest, AllUsersRequest>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== "" && value !== null
          )
        );

        const queryString = new URLSearchParams(
          filteredParams as Record<string, string>
        ).toString();

        return `${USER_PATH}/?${queryString}`;
      },
      providesTags: ["User"],
    }),

    getUser: builder.query<UserResponse, number>({
      query: (user_id) => ({
        url: `${USER_PATH}/${String(user_id)}/`,
        method: "GET",
      }),
      providesTags: (__result, __error, id) => [{ type: "User", id }],
    }),

    addUser: builder.mutation<UserResponse, UserRequest>({
      query: (data) => ({
        url: `${USER_PATH}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<
      UserResponse,
      { id: number; data: UserRequest }
    >({
      query: (params) => ({
        url: `${USER_PATH}/${String(params.id)}/`,
        method: "PUT",
        body: params.data,
      }),
      invalidatesTags: (__result, __error, { id }) => [{ type: "User", id }],
    }),

    patchUser: builder.mutation<
      UserResponse,
      { id: number; data: Partial<UserRequest> }
    >({
      query: (params) => ({
        url: `${USER_PATH}/${String(params.id)}/`,
        method: "PATCH",
        body: params.data,
      }),
      invalidatesTags: (__result, __error, { id }) => [{ type: "User", id }],
    }),

    deleteUser: builder.mutation<null, number>({
      query: (user_id) => ({
        url: `${USER_PATH}/${String(user_id)}/`,
        method: "DELETE",
      }),
      invalidatesTags: (__result, __error, id) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  usePatchUserMutation,
  useDeleteUserMutation,
} = userApi;
