import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UUID } from "crypto";
import type { DiseaseBasic } from "../types";

interface DiseaseTableProps {
  data: DiseaseBasic[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onEdit: (record: DiseaseBasic) => void;
  onDelete: (id: UUID) => void;
  onPageChange: (page: number, size: number) => void;
}

export function DiseaseTable({
  data,
  loading,
  currentPage,
  pageSize,
  total,
  onEdit,
  onDelete,
  onPageChange,
}: DiseaseTableProps) {
  const columns: ColumnsType<DiseaseBasic> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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

  return (
    <Table
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
      scroll={{ x: 600 }}
      locale={{
        emptyText: "No diseases found",
      }}
    />
  );
}
