import { MailOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";
import { Link } from "react-router";

const { Title, Paragraph } = Typography;

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const onFinish = (values: { email: string }) => {
    console.log("Forgot password request for:", values.email);
    setEmail(values.email);
    setSubmitted(true);
    // Here you would typically make an API call to send a reset link
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-md">
        <div className="text-center mb-6">
          <Title level={2} className="mb-1">
            Forgot Password
          </Title>
          <Paragraph className="text-gray-500">
            Enter your email to receive a password reset link
          </Paragraph>
        </div>

        {submitted ? (
          <div className="text-center">
            <Alert
              type="success"
              message="Reset link sent!"
              description={
                <p>
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your inbox and follow the instructions.
                </p>
              }
              showIcon
              className="mb-4"
            />
            <Button type="primary" onClick={() => setSubmitted(false)}>
              Try Another Email
            </Button>
            <div className="mt-4">
              <Link to="/login" className="text-blue-500 hover:text-blue-700">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <Form
            name="forgot-password"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Send Reset Link
              </Button>
            </Form.Item>

            <div className="text-center">
              <Paragraph className="text-sm text-gray-500">
                Remembered your password?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-700">
                  Log in
                </Link>
              </Paragraph>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
