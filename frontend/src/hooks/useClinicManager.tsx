import { useEffect, useState } from "react";
import {
  useAddClinicMutation,
  useDeleteClinicMutation,
  useGetAllClinicsQuery,
  usePathClinicMutation,
  useUpdateBulkClinicMutation,
  useUpdateClinicMutation,
} from "../redux";
import type { AllClinicRequest } from "../types";
import { useDebouncedValue } from "./useDebounce";

export function useClinicManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const { value: debouncedSearch } = useDebouncedValue(searchText, {
    delay: 500,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const clinicQueries: AllClinicRequest = {
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: debouncedSearch || undefined,
  };

  const {
    data: clinicData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllClinicsQuery(clinicQueries);

  const [addClinic, addState] = useAddClinicMutation();
  const [updateClinic, updateState] = useUpdateClinicMutation();
  const [deleteClinic, deleteState] = useDeleteClinicMutation();
  const [patchClinic, patchState] = usePathClinicMutation();
  const [updateBulkClinic, updateBulkClinicState] =
    useUpdateBulkClinicMutation();

  return {
    clinicData,
    setCurrentPage,
    setPageSize,
    setSearchText,
    currentPage,
    pageSize,
    searchText,
    isFetching,
    isLoading,
    refetch,
    addClinic,
    addState,
    updateClinic,
    updateState,
    deleteClinic,
    deleteState,
    patchClinic,
    patchState,
    updateBulkClinic,
    updateBulkClinicState,
  };
}
