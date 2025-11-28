import { useEffect, useState } from "react";
import {
  useAddSpecialityMutation,
  useDeleteSpecialityMutation,
  useGetAllSpecialitiesQuery,
  usePatchSpecialityMutation,
  useUpdateBulkSpecialityMutation,
  useUpdateSpecialityMutation,
} from "../redux";
import type { AllSpecialityRequest, SpecialityBasic } from "../types";
import { useDebouncedValue } from "./useDebounce";

export function useSpecialityManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const { value: debouncedSearch } = useDebouncedValue(searchText, {
    delay: 500,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpeciality, setEditingSpeciality] =
    useState<SpecialityBasic | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const specialityQueries: AllSpecialityRequest = {
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: debouncedSearch || undefined,
  };

  const {
    data: specialitiesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllSpecialitiesQuery(specialityQueries);

  const [addSpeciality, addState] = useAddSpecialityMutation();
  const [updateSpeciality, updateState] = useUpdateSpecialityMutation();
  const [deleteSpeciality, deleteState] = useDeleteSpecialityMutation();
  const [patchSpeciality, patchState] = usePatchSpecialityMutation();
  const [updateBulkSpeciality, updateBulkSpecialityState] =
    useUpdateBulkSpecialityMutation();

  return {
    specialitiesData,
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
    editingSpeciality,
    setEditingSpeciality,
    addSpeciality,
    updateSpeciality,
    deleteSpeciality,
    patchSpeciality,
    updateBulkSpeciality,
    addState,
    updateState,
    deleteState,
    patchState,
    updateBulkSpecialityState,
    refetch,
  };
}
