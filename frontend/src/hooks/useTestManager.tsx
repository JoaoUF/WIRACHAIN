import { useEffect, useState } from "react";
import {
  useAddTestMutation,
  useDeleteTestMutation,
  useGetAllTestsQuery,
  usePatchTestMutation,
  useUpdateBulkTestMutation,
  useUpdateTestMutation,
} from "../redux";
import type { AllTestRequest } from "../types";

export function useTestManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  const queries: AllTestRequest = {
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: searchText || undefined,
  };

  const {
    data: testsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllTestsQuery(queries);

  const [addTest, addState] = useAddTestMutation();
  const [updateTest, updateState] = useUpdateTestMutation();
  const [deleteTest, deleteState] = useDeleteTestMutation();
  const [patchTest, patchState] = usePatchTestMutation();
  const [updateBulkTest, updateBulkTestState] = useUpdateBulkTestMutation();

  return {
    // data + status
    testsData,
    isLoading,
    isFetching,
    refetch,

    // pagination/search state
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    searchText,
    setSearchText,

    // mutations + states
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
  };
}
