import { useEffect, useState } from "react";
import {
  useAddTestMutation,
  useDeleteTestMutation,
  useGetAllTestsQuery,
  usePatchTestMutation,
  useUpdateBulkTestMutation,
  useUpdateTestMutation,
} from "../redux";
import type { AllTestRequest, TestBasic } from "../types";
import { useDebouncedValue } from "./useDebounce";

export function useTestManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const { value: debouncedSearch } = useDebouncedValue(searchText, {
    delay: 500,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<TestBasic | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const testQueries: AllTestRequest = {
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: debouncedSearch || undefined,
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
    updateBulkTest,
    addState,
    updateState,
    deleteState,
    patchState,
    updateBulkTestState,
    refetch,
  };
}
