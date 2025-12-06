import { Empty, Table, type TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback } from "react";
import type { UserBasic } from "../types/User";

interface DoctorTableProps {
  data: UserBasic[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  selectedRowKeys: React.Key[];
  onEdit: (record: UserBasic) => void;
  onPageChange: (page: number, size: number) => void;
  onSelectChange: (selected: React.Key[]) => void;
  onSearchChange?: (value: string | undefined) => void;
}

const IGNORED_SELECTORS = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  ".ant-checkbox",
  ".ant-checkbox-input",
  ".ant-table-selection-column",
  ".ant-btn",
  ".anticon",
];

export function DoctorTable({
  data,
  loading,
  currentPage,
  pageSize,
  total,
  selectedRowKeys,
  onEdit,
  onPageChange,
  onSelectChange,
}: DoctorTableProps) {
  const columns: ColumnsType<UserBasic> = [
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
      ellipsis: true,
      render: (_text: string, record: UserBasic) => (
        <span className="text-gray-600">
          {record.first_name} {record.last_name}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      ellipsis: true,
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Document",
      dataIndex: "document_value",
      key: "document_value",
      ellipsis: true,
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      ellipsis: true,
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleTableChange: TableProps<UserBasic>["onChange"] = (pagination) => {
    const nextPage = pagination?.current ?? 1;
    const nextPageSize = pagination?.pageSize ?? pageSize;
    onPageChange(nextPage, nextPageSize);
  };

  const onRow = useCallback(
    (record: UserBasic) => ({
      className: "clickable-row",
      tabIndex: 0,
      onClick: (event: React.MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (!target) {
          onEdit(record);
          return;
        }
        for (const sel of IGNORED_SELECTORS) {
          if (target.closest(sel)) return;
        }
        onEdit(record);
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          const target = event.target as HTMLElement | null;
          if (target) {
            for (const sel of IGNORED_SELECTORS) {
              if (target.closest(sel)) return;
            }
          }
          event.preventDefault();
          onEdit(record);
        }
      },
    }),
    [onEdit]
  );

  return (
    <Table
      bordered
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      size="small"
      pagination={{
        current: currentPage,
        pageSize,
        total,
        onChange: onPageChange,
        showSizeChanger: true,
        showTotal: (tot) => `Total ${tot} tests`,
        align: "center",
        position: ["bottomCenter"],
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
      onChange={handleTableChange}
      onRow={onRow}
      scroll={{ x: 800 }}
      locale={{
        emptyText: <Empty />,
      }}
    />
  );
}
