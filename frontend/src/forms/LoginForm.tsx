import { Button, Form, Typography } from "antd";
import { useLogin } from "../hooks";
import type { LoginRequest } from "../types";
import { LoginItems } from "./LoginItems";

const { Title } = Typography;

export const LoginForm = () => {
  const { handleLogin, isLoading } = useLogin();
  const [form] = Form.useForm<LoginRequest>();

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
      <Title level={2} className="text-center mb-6">
        Login
      </Title>

      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={handleLogin}
        disabled={isLoading}
        autoComplete="off"
      >
        <LoginItems />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            size="large"
            block
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
