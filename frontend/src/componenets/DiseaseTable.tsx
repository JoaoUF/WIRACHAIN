import { Empty, Table, Tag } from "antd";
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
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 140,
      filters: [
        { text: "Active", value: 1 },
        { text: "Inactive", value: 0 },
      ],
      filterMultiple: false,
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

  /**
   * onRow click/focus handler:
   * - returns props for the row element (className, tabIndex, onClick, onKeyDown)
   * - ignores clicks coming from interactive elements like checkboxes, buttons, links, inputs, etc.
   */
  const onRow = (record: DiseaseBasic) => {
    return {
      className: "clickable-row",
      tabIndex: 0, // make row focusable
      onClick: (event: React.MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (!target) {
          onEdit(record);
          return;
        }

        // Ignore clicks that originate from common interactive controls inside a row
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
        // Allow Enter or Space to trigger edit when row is focused
        if (event.key === "Enter" || event.key === " ") {
          const target = event.target as HTMLElement | null;
          // Prevent triggering when event originates from interactive children
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
          // Avoid default space scroll behavior
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
        showTotal: (tot) => `Total ${tot} diseases`,
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
