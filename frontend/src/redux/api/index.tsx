export {
  authApi,
  useGetPayloadQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResendEmailMutation,
  useVerifyEmailMutation,
} from "./AuthAPI";
export { cityApi, useGetAllCitiesQuery, useGetCityQuery } from "./CityAPI";
export {
  countryApi,
  useGetAllCountriesQuery,
  useGetCountryQuery,
  useLazyGetAllCountriesQuery,
} from "./CountryAPI";
export {
  diseaseApi,
  useAddDiseaseMutation,
  useDeleteDiseaseMutation,
  useGetAllDiseasesQuery,
  useGetDiseaseQuery,
  usePatchDiseaseMutation,
  useUpdateBulkDiseaseMutation,
  useUpdateDiseaseMutation,
} from "./DiseaseAPI";
export {
  regionApi,
  useGetAllRegionsQuery,
  useGetRegionQuery,
} from "./RegionAPI";
export {
  specialityApi,
  useAddSpecialityMutation,
  useDeleteSpecialityMutation,
  useGetAllSpecialitiesQuery,
  useGetSpecialityQuery,
  usePatchSpecialityMutation,
  useUpdateBulkSpecialityMutation,
  useUpdateSpecialityMutation,
} from "./SpecialityAPI";
export {
  subRegionApi,
  useGetAllSubRegionQuery,
  useGetSubRegionQuery,
} from "./SubRegionAPI";
export {
  testApi,
  useAddTestMutation,
  useDeleteTestMutation,
  useGetAllTestsQuery,
  useGetTestQuery,
  usePatchTestMutation,
  useUpdateBulkTestMutation,
  useUpdateTestMutation,
} from "./TestAPI";
export {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useGetUserQuery,
  usePatchUserMutation,
  userApi,
  useUpdateUserMutation,
} from "./UserAPI";
