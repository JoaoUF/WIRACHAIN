import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { authApi, diseaseApi, specialityApi, testApi, userApi } from "./api";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [diseaseApi.reducerPath]: diseaseApi.reducer,
    [testApi.reducerPath]: testApi.reducer,
    [specialityApi.reducerPath]: specialityApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(diseaseApi.middleware)
      .concat(testApi.middleware)
      .concat(specialityApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export {
  useAddDiseaseMutation,
  useAddSpecialityMutation,
  useAddTestMutation,
  useAddUserMutation,
  useDeleteBulkDiseaseMutation,
  useDeleteBulkSpecialityMutation,
  useDeleteBulkTestMutation,
  useDeleteDiseaseMutation,
  useDeleteSpecialityMutation,
  useDeleteTestMutation,
  useDeleteUserMutation,
  useGetAllDiseasesQuery,
  useGetAllSpecialitiesQuery,
  useGetAllTestsQuery,
  useGetAllUsersQuery,
  useGetDiseaseQuery,
  useGetSpecialityQuery,
  useGetTestQuery,
  useGetUserQuery,
  useLoginMutation,
  useLogoutMutation,
  usePatchDiseaseMutation,
  usePatchSpecialityMutation,
  usePatchTestMutation,
  usePatchUserMutation,
  useUpdateBulkDiseaseMutation,
  useUpdateBulkSpecialityMutation,
  useUpdateBulkTestMutation,
  useUpdateDiseaseMutation,
  useUpdateSpecialityMutation,
  useUpdateTestMutation,
  useUpdateUserMutation,
} from "./api";
