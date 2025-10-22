import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { Link } from "react-router";
import { ROUTES } from "../routers/routes";

export const LoginItems = () => {
  return (
    <>
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
    </>
  );
};
