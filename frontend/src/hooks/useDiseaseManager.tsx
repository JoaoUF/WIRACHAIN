import { useEffect, useState } from "react";
import {
  useAddDiseaseMutation,
  useDeleteDiseaseMutation,
  useGetAllDiseasesQuery,
  usePatchDiseaseMutation,
  useUpdateBulkDiseaseMutation,
  useUpdateDiseaseMutation,
} from "../redux";
import type { AllDiseasesRequest, DiseaseBasic } from "../types";
import { useDebouncedValue } from "./useDebounce";

export function useDiseaseManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const { value: debouncedSearch } = useDebouncedValue(searchText, {
    delay: 500,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState<DiseaseBasic | null>(
    null
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const diseaseQueries: AllDiseasesRequest = {
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
  const [updateBulkDisease, updateBulkDiseaseState] =
    useUpdateBulkDiseaseMutation();

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
    updateBulkDisease,
    addState,
    updateState,
    deleteState,
    patchState,
    updateBulkDiseaseState,
    refetch,
  };
}
