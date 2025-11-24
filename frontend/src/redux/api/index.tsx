export {
  authApi,
  useGetPayloadQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResendEmailMutation,
  useVerifyEmailMutation,
} from "./AuthAPI";
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
