import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { authApi, diseaseApi, userApi } from "./api";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [diseaseApi.reducerPath]: diseaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(diseaseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export {
  useAddDiseaseMutation,
  useAddUserMutation,
  useDeleteBulkDiseaseMutation,
  useDeleteDiseaseMutation,
  useDeleteUserMutation,
  useGetAllDiseasesQuery,
  useGetAllUsersQuery,
  useGetDiseaseQuery,
  useGetUserQuery,
  useLoginMutation,
  useLogoutMutation,
  usePatchDiseaseMutation,
  usePatchUserMutation,
  useUpdateBulkDiseaseMutation,
  useUpdateDiseaseMutation,
  useUpdateUserMutation,
} from "./api";
