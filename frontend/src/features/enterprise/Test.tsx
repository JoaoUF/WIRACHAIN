import {
  CheckCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Grid,
  Input,
  Popconfirm,
  Tooltip,
  Typography,
} from "antd";
import type { UUID } from "crypto";
import { useState } from "react";
import { TestTable } from "../../componenets";
import { globalMessage } from "../../contexts/MessageProvider";
import { TestFormModal } from "../../forms";
import { useTestManager } from "../../hooks";
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
    searchText,
    setSearchText,
    isModalOpen,
    setIsModalOpen,
    editingTest,
    setEditingTest,
    addTest,
    updateTest,
    updateBulkTest,
    addState,
    deleteBulkTest,
    updateState,
    user,
    statusFilter,
    setStatusFilter,
    refetch,
  } = useTestManager();

  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const screens = useBreakpoint();

  const handleEdit = (record: TestBasic) => {
    setEditingTest(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: {
    name: string;
    description: string;
  }) => {
    try {
      const payload = {
        ...values,
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        enterprise_user: user?.user_id!,
        ...(editingTest?.id && { id: editingTest.id }),
      };
      if (editingTest) {
        await updateTest(payload).unwrap();
      } else {
        await addTest(payload).unwrap();
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingTest(null);
      refetch?.();
    } catch (error) {
      console.error("ERROR", error);
      globalMessage.error({
        content: "Failed to save test",
      });
    }
  };

  const handleAdd = () => {
    setEditingTest(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleBulkDelete = async () => {
    try {
      await deleteBulkTest(selectedRowKeys as UUID[]).unwrap();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("ERROR", error);
      globalMessage.error({
        content: "Failed to delete tests",
      });
    }
  };

  const handleBulkStatusChange = async (newStatus: number) => {
    try {
      await updateBulkTest({
        list_ids: selectedRowKeys as UUID[],
        new_status: newStatus,
      }).unwrap();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("ERROR", error);
      globalMessage.error({
        content:
          newStatus === 1
            ? "Failed to set tests as active."
            : "Failed to set tests as inactive.",
      });
    }
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
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            justifyContent: "space-between",
            marginBottom: screens.sm ? 18 : 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 160,
            }}
          >
            <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 20 }} />
            <div>
              <Title
                level={4}
                style={{
                  color: "#2f54eb",
                  margin: 0,
                  fontSize: 18,
                  lineHeight: 1.1,
                }}
              >
                Tests
              </Title>
              <div style={{ color: "#6c6f93", fontSize: 12 }}>
                Catalog & quick actions
              </div>
            </div>
          </div>

          <div
            style={{
              flex: screens.sm ? "1 1 auto" : "1 1 100%",
              display: "flex",
              justifyContent: screens.sm ? "center" : "stretch",
              paddingLeft: screens.sm ? 8 : 0,
              paddingRight: screens.sm ? 8 : 0,
              minWidth: 0,
            }}
          >
            <Input
              placeholder="Search tests..."
              prefix={<SearchOutlined style={{ color: "#2f54eb" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                width: screens.sm ? "50%" : "100%",
                maxWidth: "100%",
                minWidth: 0,
                borderRadius: 8,
                height: screens.xs ? 36 : 36,
                background: "#fbfcff",
                border: "1px solid #e6e7f5",
              }}
              allowClear
              size="small"
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: screens.sm ? "auto" : "100%",
              marginTop: screens.sm ? 0 : 8,
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="middle"
              style={{
                backgroundColor: "#2f54eb",
                width: screens.sm ? "auto" : "100%",
                borderRadius: 8,
              }}
              aria-label="Add"
            >
              Add
            </Button>
          </div>
        </div>
        {/* End Header */}

        <Divider
          style={{
            margin: screens.sm ? "12px 0 18px 0" : "8px 0 12px 0",
            borderColor: "#e6e7f5",
          }}
        />

        {/* Bulk Actions block */}
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
            maxWidth: "100%",
          }}
        >
          <Popconfirm
            title="Delete selected tests"
            disabled={selectedRowKeys.length === 0}
            onConfirm={handleBulkDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="default"
              danger
              block
              disabled={selectedRowKeys.length === 0}
              icon={<DeleteOutlined />}
              size={"small"}
              style={{
                width: screens.sm ? "min-content" : "100%",
              }}
            >
              Delete
            </Button>
          </Popconfirm>

          <Tooltip title="Make selected tests active">
            <Button
              disabled={selectedRowKeys.length === 0}
              icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              onClick={() => handleBulkStatusChange(1)}
              block
              style={{
                background: "#f4fff7",
                borderColor: "#b7eb8f",
                color: "#389e0d",
                width: screens.sm ? "min-content" : "100%",
              }}
              size={"small"}
            >
              Set Active
            </Button>
          </Tooltip>

          <Tooltip title="Make selected tests inactive">
            <Button
              disabled={selectedRowKeys.length === 0}
              icon={<StopOutlined style={{ color: "#b71c1c" }} />}
              onClick={() => handleBulkStatusChange(0)}
              block
              style={{
                background: "#fff5f6",
                borderColor: "#ffccc7",
                color: "#b71c1c",
                width: screens.sm ? "min-content" : "100%",
              }}
              size={"small"}
            >
              Set Inactive
            </Button>
          </Tooltip>

          <div
            style={{
              color: "#787a99",
              fontSize: 13,
              fontWeight: 400,
              minWidth: 68,
              textAlign: screens.sm ? "right" : "left",
              paddingTop: 3,
              marginLeft: screens.sm ? "auto" : 0,
            }}
          >
            {selectedRowKeys.length > 0
              ? `Selected: ${selectedRowKeys.length}`
              : ""}
          </div>
        </div>
        {/* End Bulk Actions */}

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
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>
      </Card>

      <TestFormModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingTest(null);
        }}
        onFinish={handleSubmit}
        loading={addState.isLoading || updateState.isLoading}
        editingTest={editingTest}
        form={form}
      />
    </div>
  );
}
