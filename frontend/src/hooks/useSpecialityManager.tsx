import { useEffect, useState } from "react";
import {
  useAddSpecialityMutation,
  useDeleteBulkSpecialityMutation,
  useDeleteSpecialityMutation,
  useGetAllSpecialitiesQuery,
  usePatchSpecialityMutation,
  useUpdateBulkSpecialityMutation,
  useUpdateSpecialityMutation,
} from "../redux";
import type { AllSpecialityRequest, SpecialityBasic } from "../types";
import { useAuth } from "./useAuth";

export function useSpecialityManager() {
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(
    undefined
  );
  const [editingSpeciality, setEditingSpeciality] =
    useState<SpecialityBasic | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const specialityQueries: AllSpecialityRequest = {
    enterprise_user: user?.user_id,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter !== undefined ? statusFilter : undefined,
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
  const [deleteBulkSpeciality, deleteBulkState] =
    useDeleteBulkSpecialityMutation();
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
    deleteBulkSpeciality,
    updateBulkSpeciality,
    addState,
    updateState,
    deleteState,
    patchState,
    deleteBulkState,
    updateBulkSpecialityState,
    refetch,
    user,
    statusFilter,
    setStatusFilter,
  };
}
