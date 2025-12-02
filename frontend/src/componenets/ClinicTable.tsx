import { Empty } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import Table from "antd/es/table";
import { useNavigate } from "react-router";
import { ROUTES } from "../routers/routes";
import type { TableClinicResponse } from "./../types";

interface ClinicTableProps {
  data: TableClinicResponse[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  selectedRowKeys: React.Key[];
  onPageChange: (page: number, size: number) => void;
  onSelectChange: (selected: React.Key[]) => void;
}

export function ClinicTable({
  data,
  loading,
  currentPage,
  pageSize,
  total,
  selectedRowKeys,
  onPageChange,
  onSelectChange,
}: ClinicTableProps) {
  const navigate = useNavigate();
  const columns: ColumnsType<TableClinicResponse> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (_text: string, record: TableClinicResponse) => (
        <span className="text-gray-600">{record.name}</span>
      ),
    },
    {
      title: "Mail",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      render: (text: string) => (
        <span className="text-gray-600">{text || "No description"}</span>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      ellipsis: true,
      render: (_text: string, record: TableClinicResponse) => (
        <span className="text-gray-600">{record.country.name}</span>
      ),
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
      ellipsis: true,
      render: (_text: string, record: TableClinicResponse) => (
        <span className="text-gray-600">{record.region.name}</span>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleTableChange: TableProps<TableClinicResponse>["onChange"] = (
    pagination
  ) => {
    const nextPage = pagination?.current ?? 1;
    const nextPageSize = pagination?.pageSize ?? pageSize;
    onPageChange(nextPage, nextPageSize);
  };

  const onRow = (record: TableClinicResponse) => {
    return {
      className: "clickable-row",
      tabIndex: 0,
      onClick: (event: React.MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (!target) {
          console.log(record.id);
          navigate(ROUTES.ACTIVATE_ACCOUNT);
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

        navigate(ROUTES.ACTIVATE_ACCOUNT);
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
        showTotal: (tot) => `Total ${tot} clinics`,
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
