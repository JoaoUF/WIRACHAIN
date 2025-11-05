import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
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
  onDelete,
  onPageChange,
  onSelectChange,
}: DiseaseTableProps) {
  const columns: ColumnsType<DiseaseBasic> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
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
      render: (status: number) =>
        status === 1 ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: unknown, record: DiseaseBasic) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="text-blue-600 hover:text-blue-700"
          />
          <Popconfirm
            title="Delete disease"
            description="Are you sure you want to delete this disease?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
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
