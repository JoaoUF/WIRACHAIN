import { useEffect, useState } from "react";
import {
  useAddTestMutation,
  useDeleteBulkTestMutation,
  useDeleteTestMutation,
  useGetAllTestsQuery,
  usePatchTestMutation,
  useUpdateBulkTestMutation,
  useUpdateTestMutation,
} from "../redux";
import type { AllTestRequest, TestBasic } from "../types";
import { useAuth } from "./useAuth";

export function useTestManager() {
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(
    undefined
  );
  const [editingTest, setEditingTest] = useState<TestBasic | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const testQueries: AllTestRequest = {
    enterprise_user: user?.user_id,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter !== undefined ? statusFilter : undefined,
  };

  const {
    data: testsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllTestsQuery(testQueries);

  const [addTest, addState] = useAddTestMutation();
  const [updateTest, updateState] = useUpdateTestMutation();
  const [deleteTest, deleteState] = useDeleteTestMutation();
  const [patchTest, patchState] = usePatchTestMutation();
  const [deleteBulkTest, deleteBulkState] = useDeleteBulkTestMutation();
  const [updateBulkTest, updateBulkTestState] = useUpdateBulkTestMutation();

  return {
    testsData,
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
    editingTest,
    setEditingTest,
    addTest,
    updateTest,
    deleteTest,
    patchTest,
    deleteBulkTest,
    updateBulkTest,
    addState,
    updateState,
    deleteState,
    patchState,
    deleteBulkState,
    updateBulkTestState,
    refetch,
    user,
    statusFilter,
    setStatusFilter,
  };
}
