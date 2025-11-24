import {
  CheckCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Grid,
  Input,
  Popconfirm,
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
    updateState,
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

  const handleBulkStatusChange = async () => {
    try {
      await updateBulkDisease({
        list_ids: selectedRowKeys as UUID[],
      }).unwrap();
      setSelectedRowKeys([]);
    } catch {
      console.log("ERROR");
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
        {/* --- Header: title left, flexible search center, add right (desktop).
              Mobile: stacked title / search / add */}
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
          {/* Left: compact title */}
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
                Diseases
              </Title>
              <div style={{ color: "#6c6f93", fontSize: 12 }}>
                Catalog & quick actions
              </div>
            </div>
          </div>

          {/* Center / Middle: flexible search on desktop; full width on mobile */}
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
              placeholder="Search diseases..."
              prefix={<SearchOutlined style={{ color: "#2f54eb" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                // width: screens.sm ? 320 : "100%",
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

          {/* Right: Add button — icon circle on desktop, full-width labeled on mobile */}
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
        {/* --- End Header --- */}

        <Divider
          style={{
            margin: screens.sm ? "12px 0 18px 0" : "8px 0 12px 0",
            borderColor: "#e6e7f5",
          }}
        />

        {/* --- Bulk Actions: single place for all devices (no duplication in header) */}
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
            title="Delete selected diseases"
            disabled={selectedRowKeys.length === 0}
            onConfirm={handleBulkStatusChange}
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
