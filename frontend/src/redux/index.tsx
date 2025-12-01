import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
  authApi,
  cityApi,
  clinicApi,
  countryApi,
  diseaseApi,
  regionApi,
  specialityApi,
  subRegionApi,
  testApi,
  userApi,
} from "./api";
import { ErrorMiddleware } from "./middleware";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [diseaseApi.reducerPath]: diseaseApi.reducer,
    [testApi.reducerPath]: testApi.reducer,
    [specialityApi.reducerPath]: specialityApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
    [regionApi.reducerPath]: regionApi.reducer,
    [subRegionApi.reducerPath]: subRegionApi.reducer,
    [cityApi.reducerPath]: cityApi.reducer,
    [clinicApi.reducerPath]: clinicApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      diseaseApi.middleware,
      testApi.middleware,
      specialityApi.middleware,
      countryApi.middleware,
      regionApi.middleware,
      subRegionApi.middleware,
      cityApi.middleware,
      clinicApi.middleware,
      ErrorMiddleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export {
  useAddClinicMutation,
  useAddDiseaseMutation,
  useAddSpecialityMutation,
  useAddTestMutation,
  useAddUserMutation,
  useDeleteClinicMutation,
  useDeleteDiseaseMutation,
  useDeleteSpecialityMutation,
  useDeleteTestMutation,
  useDeleteUserMutation,
  useGetAllCitiesQuery,
  useGetAllClinicsQuery,
  useGetAllCountriesQuery,
  useGetAllDiseasesQuery,
  useGetAllRegionsQuery,
  useGetAllSpecialitiesQuery,
  useGetAllSubRegionQuery,
  useGetAllTestsQuery,
  useGetAllUsersQuery,
  useGetCityQuery,
  useGetClinicQuery,
  useGetCountryQuery,
  useGetDiseaseQuery,
  useGetRegionQuery,
  useGetSpecialityQuery,
  useGetSubRegionQuery,
  useGetTestQuery,
  useGetUserQuery,
  useLazyGetAllCountriesQuery,
  useLoginMutation,
  useLogoutMutation,
  usePatchDiseaseMutation,
  usePatchSpecialityMutation,
  usePatchTestMutation,
  usePatchUserMutation,
  usePathClinicMutation,
  useRegisterMutation,
  useResendEmailMutation,
  useUpdateBulkClinicMutation,
  useUpdateBulkDiseaseMutation,
  useUpdateBulkSpecialityMutation,
  useUpdateBulkTestMutation,
  useUpdateClinicMutation,
  useUpdateDiseaseMutation,
  useUpdateSpecialityMutation,
  useUpdateTestMutation,
  useUpdateUserMutation,
  useVerifyEmailMutation,
} from "./api";
