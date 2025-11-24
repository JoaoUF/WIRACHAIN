import { Empty, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import React from "react";
import type { SpecialityBasic } from "../types";

interface SpecialityTableProps {
  data: SpecialityBasic[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  selectedRowKeys: React.Key[];
  onEdit: (record: SpecialityBasic) => void;
  onPageChange: (page: number, size: number) => void;
  onSelectChange: (selected: React.Key[]) => void;
}

export function SpecialityTable({
  data,
  loading,
  currentPage,
  pageSize,
  total,
  selectedRowKeys,
  onEdit,
  onPageChange,
  onSelectChange,
}: SpecialityTableProps) {
  const columns: ColumnsType<SpecialityBasic> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (_text: string, record: SpecialityBasic) => (
        <span className="text-gray-600">{record.name}</span>
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
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleTableChange: TableProps<SpecialityBasic>["onChange"] = (
    pagination
  ) => {
    const nextPage = pagination?.current ?? 1;
    const nextPageSize = pagination?.pageSize ?? pageSize;
    onPageChange(nextPage, nextPageSize);
  };

  const onRow = (record: SpecialityBasic) => {
    return {
      className: "clickable-row",
      tabIndex: 0,
      onClick: (event: React.MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (!target) {
          onEdit(record);
          return;
        }

        const ignoredSelectors = [
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

        for (const sel of ignoredSelectors) {
          if (target.closest(sel)) return;
        }

        onEdit(record);
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          const target = event.target as HTMLElement | null;
          const ignoredSelectors = [
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
          if (target) {
            for (const sel of ignoredSelectors) {
              if (target.closest(sel)) return;
            }
          }
          event.preventDefault();
          onEdit(record);
        }
      },
    };
  };

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
        pageSize: pageSize,
        total,
        onChange: onPageChange,
        showSizeChanger: true,
        showTotal: (tot) => `Total ${tot} specialities`,
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
