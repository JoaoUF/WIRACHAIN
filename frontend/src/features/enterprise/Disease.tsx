import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Typography } from "antd";
import type { UUID } from "crypto";
import { DiseaseTable } from "../../componenets";
import { DiseaseFormModal } from "../../forms";
import { useDiseaseManager } from "../../hooks";
import type { DiseaseBasic } from "../../types";

const { Title } = Typography;

export default function Disease() {
  // const formRef = useRef<any>();
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
    deleteDisease,
    addState,
    updateState,
    user,
  } = useDiseaseManager();
  const [form] = Form.useForm();

  const handleEdit = (record: DiseaseBasic) => {
    setEditingDisease(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: UUID) => {
    try {
      await deleteDisease(id).unwrap();
      message.success("Disease deleted successfully");
    } catch (error) {
      console.log("ERROR", error);
      message.error("Failed to delete disease");
    }
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
        message.success("Disease updated successfully");
      } else {
        await addDisease(diseaseData).unwrap();
        message.success("Disease added successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingDisease(null);
    } catch (error) {
      console.log("ERROR", error);
      message.error("Failed to save disease");
    }
  };

  const handleAdd = () => {
    setEditingDisease(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <Card bordered={false} className="shadow-sm">
        <div className="mb-4 md:mb-6">
          <Title level={2} className="!mb-2">
            Diseases Management
          </Title>
          <p className="text-gray-500 text-sm md:text-base">
            Manage your medical diseases catalog
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            placeholder="Search diseases..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-64 md:w-80"
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="w-full sm:w-auto"
            style={{ backgroundColor: "#2f54eb" }}
          >
            Add Disease
          </Button>
        </div>
        <div className="overflow-x-auto">
          <DiseaseTable
            data={diseasesData?.results || []}
            loading={isLoading || isFetching}
            currentPage={currentPage}
            pageSize={pageSize}
            total={diseasesData?.count || 0}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
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
