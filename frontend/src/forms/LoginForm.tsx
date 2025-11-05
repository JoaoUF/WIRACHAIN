import {
  GithubOutlined,
  GoogleOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Divider, Form, Input, Typography } from "antd";
import { Link } from "react-router";
import { useLogin } from "../hooks";
import { ROUTES } from "../routers/routes";
import type { LoginRequest } from "../types";

const { Paragraph } = Typography;

export const LoginForm = () => {
  const [form] = Form.useForm<LoginRequest>();
  const { handleLogin, isLoading } = useLogin(form);

  return (
    <Form
      form={form}
      name="login"
      layout="vertical"
      size="large"
      autoComplete="off"
      initialValues={{ remember: true }}
      onFinish={handleLogin}
      disabled={isLoading}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-between">
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm">
            Forgot password?
          </Link>
        </div>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Log in
        </Button>
      </Form.Item>

      <div className="text-center">
        <Paragraph className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="text-blue-500 hover:text-blue-700"
          >
            Register now
          </Link>
        </Paragraph>
      </div>

      <Divider plain>or log in with</Divider>

      <div className="flex justify-center space-x-4">
        <Button icon={<GoogleOutlined />} size="large">
          Google
        </Button>
        <Button icon={<GithubOutlined />} size="large">
          GitHub
        </Button>
      </div>
    </Form>
  );
};
