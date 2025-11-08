import { Table, Tag } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import React from "react";
import type { DiseaseBasic } from "../types";

interface DiseaseTableProps {
  data: DiseaseBasic[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  selectedRowKeys: React.Key[];
  onEdit: (record: DiseaseBasic) => void;
  onPageChange: (page: number, size: number) => void;
  onSelectChange: (selected: React.Key[]) => void;
  statusFilter: number | undefined;
  setStatusFilter: (filter: number | undefined) => void;
}

export function DiseaseTable({
  data,
  loading,
  currentPage,
  pageSize,
  total,
  selectedRowKeys,
  onEdit,
  onPageChange,
  onSelectChange,
  statusFilter,
  setStatusFilter,
}: DiseaseTableProps) {
  const columns: ColumnsType<DiseaseBasic> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (_text: string, record: DiseaseBasic) => (
        <a
          className="text-blue-600 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            onEdit(record);
          }}
          role="button"
        >
          {record.name}
        </a>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => (
        <span className="text-gray-600">{text || "No description"}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 140,
      // use AntD's default filter dropdown (checkboxes + Reset / OK)
      filters: [
        { text: "Active", value: 1 },
        { text: "Inactive", value: 0 },
      ],
      // controlled "filteredValue" so the UI reflects external filter state
      filteredValue: typeof statusFilter === "number" ? [statusFilter] : null,
      render: (status: number) =>
        status === 1 ? (
          <Tag
            style={{
              background: "#f4fff7",
              borderColor: "#b7eb8f",
              color: "#389e0d",
              fontWeight: 500,
            }}
          >
            Active
          </Tag>
        ) : (
          <Tag
            style={{
              background: "#fff5f6",
              borderColor: "#ffccc7",
              color: "#b71c1c",
              fontWeight: 500,
            }}
          >
            Inactive
          </Tag>
        ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleTableChange: TableProps<DiseaseBasic>["onChange"] = (
    pagination,
    filters
  ) => {
    const nextPage = pagination?.current ?? 1;
    const nextPageSize = pagination?.pageSize ?? pageSize;
    onPageChange(nextPage, nextPageSize);

    const statusFilterValues = filters?.status as unknown;
    if (Array.isArray(statusFilterValues) && statusFilterValues.length > 0) {
      const raw = statusFilterValues[0];
      const parsed = typeof raw === "string" ? Number(raw) : Number(raw);
      setStatusFilter(Number.isNaN(parsed) ? undefined : parsed);
    } else {
      setStatusFilter(undefined);
    }
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      size="small"
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total,
        onChange: onPageChange,
        showSizeChanger: true,
        showTotal: (tot) => `Total ${tot} diseases`,
        align: "center",
        position: ["bottomCenter"],
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
      onChange={handleTableChange}
      scroll={{ x: 800 }}
      locale={{
        emptyText: "No diseases found",
      }}
    />
  );
}
