import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import {
  useAddDiseaseMutation,
  useDeleteDiseaseMutation,
  useGetAllDiseasesQuery,
  useUpdateDiseaseMutation,
} from "../../redux";
import type {
  AllDiseasesRequest,
  DiseaseBasic,
  DiseaseRequest,
} from "../../types";

const { Title } = Typography;
const { TextArea } = Input;

function Disease() {
  const { user } = useAuth();
  const [form] = Form.useForm();

  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState<DiseaseBasic | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // API queries
  const diseaseQueries: AllDiseasesRequest = {
    enterprise_user: user?.user_id,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: debouncedSearch || undefined,
  };

  const {
    data: diseasesData,
    isLoading,
    isFetching,
  } = useGetAllDiseasesQuery(diseaseQueries);
  const [addDisease, { isLoading: isAdding }] = useAddDiseaseMutation();
  const [updateDisease, { isLoading: isUpdating }] = useUpdateDiseaseMutation();
  const [deleteDisease] = useDeleteDiseaseMutation();

  // Handlers
  const handleAdd = () => {
    setEditingDisease(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: DiseaseBasic) => {
    setEditingDisease(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDisease(Number(id)).unwrap();
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
      const diseaseData: DiseaseRequest = {
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
    } catch (error) {
      console.log("ERROR", error);
      message.error(`Failed to ${editingDisease ? "update" : "add"} disease`);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingDisease(null);
  };

  // Table columns
  const columns: ColumnsType<DiseaseBasic> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      responsive: ["xs", "sm", "md", "lg"],
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["md", "lg"],
      ellipsis: true,
      render: (text: string) => (
        <span className="text-gray-600">{text || "No description"}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      responsive: ["xs", "sm", "md", "lg"],
      render: (_: unknown, record: DiseaseBasic) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-700"
          />
          <Popconfirm
            title="Delete disease"
            description="Are you sure you want to delete this disease?"
            onConfirm={() => handleDelete(String(record.id))}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
          <Table
            columns={columns}
            dataSource={diseasesData?.results || []}
            rowKey="id"
            loading={isLoading || isFetching}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: diseasesData?.count || 0,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} diseases`,
              responsive: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            scroll={{ x: 600 }}
            locale={{
              emptyText: searchText
                ? "No diseases found matching your search"
                : "No diseases yet. Add your first disease!",
            }}
          />
        </div>
      </Card>

      <Modal
        title={editingDisease ? "Edit Disease" : "Add New Disease"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        width={600}
        className="max-w-full mx-4"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          className="mt-4"
        >
          <Form.Item
            label="Disease Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the disease name" },
              { min: 2, message: "Name must be at least 2 characters" },
              { max: 100, message: "Name must not exceed 100 characters" },
            ]}
          >
            <Input placeholder="e.g., Type 2 Diabetes" size="large" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter a description" },
              {
                min: 10,
                message: "Description must be at least 10 characters",
              },
              {
                max: 500,
                message: "Description must not exceed 500 characters",
              },
            ]}
          >
            <TextArea
              placeholder="Enter a detailed description of the disease..."
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Space className="w-full flex justify-end">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isAdding || isUpdating}
                style={{ backgroundColor: "#2f54eb" }}
              >
                {editingDisease ? "Update" : "Add"} Disease
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Disease;
