import type { FormInstance } from "antd";
import { Button, Form, Input, Modal, Space } from "antd";
import type { TestBasic } from "../types";

const { TextArea } = Input;

interface TestFormModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: { name: string; description: string }) => void;
  loading?: boolean;
  editingTest?: TestBasic | null;
  form: FormInstance;
}

export function TestFormModal({
  open,
  onCancel,
  onFinish,
  loading,
  editingTest,
  form,
}: TestFormModalProps) {
  return (
    <Modal
      title={editingTest ? "Edit Test" : "Add New Test"}
      open={open}
      onCancel={onCancel}
      centered
      footer={null}
      width="min(600px, 96%)"
      className="max-w-full"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className="mt-4"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter the test name" },
            { min: 2, message: "Name must be at least 2 characters" },
            { max: 100, message: "Name must not exceed 100 characters" },
          ]}
        >
          <Input placeholder="e.g., Complete Blood Count" size="large" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter a description" },
            { min: 10, message: "Description must be at least 10 characters" },
            { max: 500, message: "Description must not exceed 500 characters" },
          ]}
        >
          <TextArea
            placeholder="Enter a detailed description..."
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item className="mb-0 mt-6">
          <Space className="w-full flex justify-end">
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ backgroundColor: "#2f54eb" }}
            >
              {editingTest ? "Update" : "Add"} Test
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
