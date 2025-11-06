import { Button, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
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
      width: 110,
      filters: [
        { text: "Active", value: 1 },
        { text: "Inactive", value: 0 },
      ],
      filteredValue: typeof statusFilter === "number" ? [statusFilter] : null,
      render: (status: number) =>
        status === 1 ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Button
            onClick={() => setStatusFilter(undefined)}
            disabled={statusFilter === undefined}
            size="small"
            style={{ width: "100%", marginBottom: 8 }}
          >
            Clear
          </Button>
          <Button
            type={statusFilter === 1 ? "primary" : "default"}
            style={{ width: "100%", marginBottom: 4 }}
            onClick={() => setStatusFilter(1)}
          >
            Active
          </Button>
          <Button
            type={statusFilter === 0 ? "primary" : "default"}
            style={{ width: "100%" }}
            onClick={() => setStatusFilter(0)}
          >
            Inactive
          </Button>
        </div>
      ),
      onFilter: () => true,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
      scroll={{ x: 800 }}
      locale={{
        emptyText: "No diseases found",
      }}
    />
  );
}
