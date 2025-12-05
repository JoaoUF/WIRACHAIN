import {
  CheckCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Grid, Popconfirm, Typography } from "antd";
import type { UUID } from "crypto";
import { useState } from "react";
import { TestTable } from "../../componenets";
import { TestForm } from "../../forms";
import { useModal, useTestManager } from "../../hooks";
import type { TestBasic } from "../../types";

const { Title } = Typography;
const { useBreakpoint } = Grid;

export default function Test() {
  const {
    testsData,
    isLoading,
    isFetching,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    setSearchText,
    addTest,
    updateTest,
    updateBulkTest,
    addState,
    updateState,
  } = useTestManager();

  const { open } = useModal();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const screens = useBreakpoint();

  const handleEdit = (record: TestBasic) => {
    open({
      title: "Edit Test",
      create: false,
      component: TestForm,
      props: { initialValues: record },
      onFinish: async (values) => {
        await updateTest({ id: record.id, ...values }).unwrap();
      },
      modalProps: { width: "min(600px, 96%)" },
      onFinishState: updateState.isLoading,
    });
  };

  const handleAdd = () => {
    open({
      title: "Add Test",
      create: true,
      component: TestForm,
      onFinish: async (values) => {
        await addTest(values).unwrap();
      },
      modalProps: { width: "min(600px, 96%)" },
      onFinishState: addState.isLoading,
    });
  };

  const handleBulkStatusChange = async () => {
    await updateBulkTest({
      list_ids: selectedRowKeys as UUID[],
    })
      .unwrap()
      .then(() => setSelectedRowKeys([]));
  };

  return (
    <div className="w-full">
      <Card
        className="shadow-sm"
        variant="borderless"
        style={{
          minHeight: 500,
          border: "none",
          boxShadow: "none",
          backgroundColor: "transparent",
        }}
        styles={{
          body: {
            padding: screens.xs
              ? "20px 8px 16px 8px"
              : screens.sm
              ? "22px 14px 20px 14px"
              : "28px 32px 24px 32px",
          },
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: screens.sm ? 18 : 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 20 }} />
            <div>
              <Title
                level={4}
                style={{ color: "#2f54eb", margin: 0, fontSize: 18 }}
              >
                Tests
              </Title>
              <div style={{ color: "#6c6f93", fontSize: 12 }}>
                Catalog & quick actions
              </div>
            </div>
          </div>

          <div style={{ flex: screens.sm ? "1 1 auto" : "1 1 100%" }} />
        </div>
        {/* End Header */}

        <Divider
          style={{
            margin: screens.sm ? "12px 0 18px 0" : "8px 0 12px 0",
            borderColor: "#e6e7f5",
          }}
        />

        {/* Bulk Actions */}
        <div
          style={{
            display: "flex",
            flexDirection: screens.sm ? "row" : "column",
            alignItems: "stretch",
            gap: 10,
            marginBottom: screens.sm ? 20 : 14,
            borderRadius: 8,
            background: "#f6f8fd",
            padding: screens.sm ? "12px 14px" : "8px 6px",
            border: "1px solid #e6e7f5",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="small"
              style={{
                backgroundColor: "#2f54eb",
                width: screens.sm ? "min-content" : "100%",
              }}
              aria-label="Add"
            >
              Add
            </Button>
          </div>

          <Popconfirm
            title="Delete selected tests"
            disabled={selectedRowKeys.length === 0}
            onConfirm={handleBulkStatusChange}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="default"
              danger
              disabled={selectedRowKeys.length === 0}
              icon={<DeleteOutlined />}
              size={"small"}
              style={{ width: screens.sm ? "min-content" : "100%" }}
            >
              Delete
            </Button>
          </Popconfirm>
          <div
            style={{
              marginLeft: screens.sm ? "auto" : 0,
              color: "#787a99",
              fontSize: 13,
            }}
          >
            {selectedRowKeys.length > 0
              ? `Selected: ${selectedRowKeys.length}`
              : ""}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <TestTable
            data={testsData?.results || []}
            loading={isLoading || isFetching}
            currentPage={currentPage}
            pageSize={pageSize}
            total={testsData?.count || 0}
            onEdit={handleEdit}
            onPageChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            selectedRowKeys={selectedRowKeys}
            onSelectChange={setSelectedRowKeys}
            onSearchChange={(v) => setSearchText(v ?? "")}
          />
        </div>
      </Card>
    </div>
  );
}
