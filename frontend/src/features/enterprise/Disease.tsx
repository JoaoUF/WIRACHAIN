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
import { DiseaseTable } from "../../componenets";
import { globalMessage } from "../../contexts/MessageProvider";
import { DiseaseFormModal } from "../../forms";
import { useDiseaseManager } from "../../hooks";
import type { DiseaseBasic } from "../../types";

const { Title } = Typography;
const { useBreakpoint } = Grid;

export default function Disease() {
  const {
    diseasesData,
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
    editingDisease,
    setEditingDisease,
    addDisease,
    updateDisease,
    updateBulkDisease,
    addState,
    deleteBulkDisease,
    updateState,
    user,
    statusFilter,
    setStatusFilter,
  } = useDiseaseManager();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const screens = useBreakpoint();

  const handleEdit = (record: DiseaseBasic) => {
    setEditingDisease(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: {
    name: string;
    description: string;
  }) => {
    try {
      const diseaseData = {
        ...values,
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        enterprise_user: user?.user_id!,
        ...(editingDisease?.id && { id: editingDisease.id }),
      };
      if (editingDisease) {
        await updateDisease(diseaseData).unwrap();
      } else {
        await addDisease(diseaseData).unwrap();
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingDisease(null);
    } catch (error) {
      console.log("ERROR", error);
      globalMessage.error({
        content: "Failed to save disease",
      });
    }
  };

  const handleAdd = () => {
    setEditingDisease(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleBulkDelete = async () => {
    try {
      await deleteBulkDisease(selectedRowKeys as UUID[]).unwrap();
      setSelectedRowKeys([]);
    } catch (error) {
      console.log("ERROR", error);
      globalMessage.error({
        content: "Failed to delete diseases",
      });
    }
  };

  const handleBulkStatusChange = async (newStatus: number) => {
    try {
      await updateBulkDisease({
        list_ids: selectedRowKeys as UUID[],
        new_status: newStatus,
      }).unwrap();
      setSelectedRowKeys([]);
    } catch (error) {
      console.log("ERROR", error);
      globalMessage.error({
        content:
          newStatus === 1
            ? "Failed to set diseases as active."
            : "Failed to set diseases as inactive.",
      });
    }
  };

  // const inputHeight = screens.xs ? 32 : undefined;
  // const inputFontSize = screens.xs ? 14 : undefined;
  const universalWidth = screens.sm ? undefined : "100%";
  // const universalHeight = screens.xs ? 32 : 40;

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
              ? "24px 8px 20px 8px"
              : screens.sm
              ? "26px 14px 22px 14px"
              : "32px 40px 28px 40px",
          },
        }}
      >
        {/* --- Header Section: Responsive Search/Add --- */}
        <div
          style={{
            display: "flex",
            flexDirection: screens.sm ? "row" : "column",
            alignItems: screens.sm ? "center" : "stretch",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginBottom: screens.sm ? 24 : 16,
            gap: screens.sm ? 16 : 10,
          }}
        >
          {/* Title and Description */}
          <div style={{ minWidth: 200, marginBottom: screens.sm ? 0 : 12 }}>
            <Title
              level={3}
              style={{
                color: "#2f54eb",
                marginBottom: 4,
                fontSize: screens.xs ? 20 : 24,
                lineHeight: 1.2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <CheckCircleOutlined
                style={{
                  color: "#52c41a",
                  marginRight: 8,
                  fontSize: screens.xs ? 19 : 22,
                }}
              />
              Diseases Management
            </Title>
            <div
              style={{
                color: "#6c6f93",
                fontSize: screens.xs ? 13 : 14,
                maxWidth: 260,
              }}
            >
              Manage your medical diseases catalog with quick search and bulk
              actions.
            </div>
          </div>

          {/* --- Responsive Search and Add --- */}
          <div
            style={{
              display: "flex",
              flexDirection: screens.sm ? "row" : "column",
              gap: 10,
              alignItems: screens.sm ? "center" : "stretch",
              width: universalWidth,
              flex: screens.sm ? "" : 1,
              marginTop: screens.sm ? 0 : 10,
            }}
          >
            <Input
              placeholder="Search diseases..."
              prefix={<SearchOutlined style={{ color: "#2f54eb" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                maxWidth: screens.xs ? "100%" : 310,
                width: universalWidth,
              }}
              allowClear
              size={"middle"}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size={"middle"}
              style={{
                backgroundColor: "#2f54eb",
                width: universalWidth,
                // minWidth: 10,
              }}
              aria-label="Add Disease"
            />
          </div>
        </div>
        {/* --- End Header Section --- */}

        <Divider
          style={{
            margin: screens.sm ? "14px 0 20px 0" : "10px 0 15px 0",
            borderColor: "#e6e7f5",
          }}
        />

        {/* --- Bulk Actions: Responsive --- */}
        <div
          style={{
            display: "flex",
            flexDirection: screens.sm ? "row" : "column",
            alignItems: "stretch",
            gap: 10,
            marginBottom: screens.sm ? 18 : 12,
            borderRadius: 8,
            background: "#f6f8fd",
            padding: screens.sm ? "14px 18px" : "10px 7px",
            border: "1px solid #e6e7f5",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <Popconfirm
            title="Delete selected diseases"
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
              Delete Selected Diseases
            </Button>
          </Popconfirm>
          <Tooltip title="Make selected diseases active">
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
              Set All As Active
            </Button>
          </Tooltip>
          <Tooltip title="Make selected diseases inactive">
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
              Set All As Inactive
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
        {/* --- End Bulk Actions --- */}

        <div className="overflow-x-auto">
          <DiseaseTable
            data={diseasesData?.results || []}
            loading={isLoading || isFetching}
            currentPage={currentPage}
            pageSize={pageSize}
            total={diseasesData?.count || 0}
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
      <DiseaseFormModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingDisease(null);
        }}
        onFinish={handleSubmit}
        loading={addState.isLoading || updateState.isLoading}
        editingDisease={editingDisease}
        form={form}
      />
    </div>
  );
}
