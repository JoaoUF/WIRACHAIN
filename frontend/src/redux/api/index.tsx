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
  useDeleteBulkDiseaseMutation,
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
  useDeleteBulkSpecialityMutation,
  useDeleteSpecialityMutation,
  useGetAllSpecialitiesQuery,
  useGetSpecialityQuery,
  usePatchSpecialityMutation,
  useUpdateBulkSpecialityMutation,
  useUpdateSpecialityMutation,
} from "./Speciality";
export {
  testApi,
  useAddTestMutation,
  useDeleteBulkTestMutation,
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
