import {
  GithubOutlined,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Checkbox, Divider, Form, Input, Typography } from "antd";
import { Link } from "react-router";

const { Title, Paragraph } = Typography;

const Register = () => {
  const onFinish = (values: any) => {
    console.log("Register form values:", values);
    // Handle registration logic here
  };

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-md shadow-md">
        <div className="text-center mb-6">
          <Title level={2} className="mb-1">
            Create Account
          </Title>
          <Paragraph className="text-gray-500">
            Join us to start using the dashboard
          </Paragraph>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="fullName"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("You must accept the terms and conditions")
                      ),
              },
            ]}
          >
            <Checkbox>
              I agree to the <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Register
            </Button>
          </Form.Item>

          <div className="text-center">
            <Paragraph className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:text-blue-700">
                Log in
              </Link>
            </Paragraph>
          </div>

          <Divider plain>or register with</Divider>

          <div className="flex justify-center space-x-4">
            <Button icon={<GoogleOutlined />} size="large">
              Google
            </Button>
            <Button icon={<GithubOutlined />} size="large">
              GitHub
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
