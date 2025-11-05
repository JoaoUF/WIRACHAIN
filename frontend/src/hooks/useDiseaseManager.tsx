import { useEffect, useState } from "react";
import {
  useAddDiseaseMutation,
  useDeleteBulkDiseaseMutation,
  useDeleteDiseaseMutation,
  useGetAllDiseasesQuery,
  usePatchDiseaseMutation,
  useUpdateDiseaseMutation,
} from "../redux";
import type { AllDiseasesRequest, DiseaseBasic } from "../types";
import { useAuth } from "./useAuth";

export function useDiseaseManager() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState<DiseaseBasic | null>(
    null
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const diseaseQueries: AllDiseasesRequest = {
    enterprise_user: user?.user_id,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: debouncedSearch || undefined,
  };

  const {
    data: diseasesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllDiseasesQuery(diseaseQueries);

  const [addDisease, addState] = useAddDiseaseMutation();
  const [updateDisease, updateState] = useUpdateDiseaseMutation();
  const [deleteDisease, deleteState] = useDeleteDiseaseMutation();
  const [patchDisease, patchState] = usePatchDiseaseMutation();
  const [deleteBulkDisease, deleteBulkState] = useDeleteBulkDiseaseMutation();

  return {
    diseasesData,
    isLoading,
    isFetching,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    searchText,
    setSearchText,
    isModalOpen,
    setIsModalOpen,
    editingDisease,
    setEditingDisease,
    addDisease,
    updateDisease,
    deleteDisease,
    patchDisease,
    deleteBulkDisease,
    addState,
    updateState,
    deleteState,
    patchState,
    deleteBulkState,
    refetch,
    user,
  };
}
