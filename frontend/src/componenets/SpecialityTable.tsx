import { SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Space, Table, type InputRef } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import React, { useCallback, useRef } from "react";
import type { DiseaseBasic, SpecialityBasic } from "../types";

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
  onSearchChange,
}: SpecialityTableProps) {
  const searchInput = useRef<InputRef>(null);

  const handleSearch = useCallback(
    (selectedKeys: string[], confirm: FilterDropdownProps["confirm"]) => {
      confirm();
      const val = selectedKeys[0];
      onSearchChange?.(val || undefined);
    },
    [onSearchChange]
  );

  const handleReset = useCallback(
    (clearFilters?: () => void) => {
      clearFilters?.();
      onSearchChange?.(undefined);
    },
    [onSearchChange]
  );

  const getNameColumnFilterProps = useCallback(
    (dataIndex: keyof SpecialityBasic) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${String(dataIndex)}`}
            value={selectedKeys[0] as string | undefined}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as string[], confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                const val = (selectedKeys as string[])[0];
                onSearchChange?.(val || undefined);
              }}
            >
              Filter
            </Button>
            <Button type="link" size="small" onClick={() => close()}>
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      filterDropdownProps: {
        onOpenChange(open: boolean) {
          if (open) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
      },
    }),
    [handleSearch, handleReset, onSearchChange]
  );

  const columns: ColumnsType<SpecialityBasic> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      ...getNameColumnFilterProps("name"),
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

  const onRow = useCallback(
    (record: DiseaseBasic) => ({
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
