import { Form, Input } from "antd";
import type { LoginRequest } from "../types";

export const LoginItems = () => {
  return (
    <>
      <Form.Item<LoginRequest>
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Invalid email" },
        ]}
      >
        <Input type="email" placeholder="Enter your email" size="large" />
      </Form.Item>

      <Form.Item<LoginRequest>
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Please input your password!" },
          { min: 4, message: "Password must be at least 6 characters" },
        ]}
      >
        <Input.Password placeholder="Enter your password" size="large" />
      </Form.Item>
    </>
  );
};
