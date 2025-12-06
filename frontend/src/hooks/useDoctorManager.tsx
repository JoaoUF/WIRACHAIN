import { useEffect, useState } from "react";
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  usePatchUserMutation,
  useUpdateBulkUsersMutation,
  useUpdateUserMutation,
} from "../redux";
import type { AllUsersRequest } from "../types";

export function useDoctorManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  const queries: AllUsersRequest = {
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: searchText || undefined,
  };

  const {
    data: doctorData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllUsersQuery(queries);

  const [addDoctor, addState] = useAddUserMutation();
  const [updateDoctor, updateState] = useUpdateUserMutation();
  const [deleteDoctor, deleteState] = useDeleteUserMutation();
  const [patchDoctor, patchState] = usePatchUserMutation();
  const [updateBulkDoctor, updateBulkState] = useUpdateBulkUsersMutation();

  return {
    doctorData,
    isLoading,
    isFetching,
    refetch,

    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    searchText,
    setSearchText,

    addDoctor,
    addState,
    updateDoctor,
    updateState,
    deleteDoctor,
    deleteState,
    patchDoctor,
    patchState,
    updateBulkDoctor,
    updateBulkState,
  };
}
