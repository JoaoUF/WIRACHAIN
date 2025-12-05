import { Button, Form, Input, Space } from "antd";
import { useEffect } from "react";
import type { TestBasic } from "../types";

const { TextArea } = Input;

type FormProps<T> = {
  onFinish: (values: Partial<T>) => Promise<void> | void;
  initialValues?: Partial<T> | null;
};

export function TestForm({ onFinish, initialValues }: FormProps<TestBasic>) {
  const [form] = Form.useForm<TestBasic>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
      className="mt-4"
      clearOnDestroy
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
          <Button onClick={() => form.resetFields()}>Reset</Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#2f54eb" }}
          >
            Save
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
