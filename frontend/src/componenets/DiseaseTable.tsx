import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UUID } from "crypto";
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
  onDelete: (id: UUID) => void;
  onPageChange: (page: number, size: number) => void;
  onSelectChange: (selected: React.Key[]) => void;
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
        {
          text: "Active",
          value: 1,
        },
        {
          text: "Inactive",
          value: 0,
        },
      ],
      render: (status: number) =>
        status === 1 ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
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
