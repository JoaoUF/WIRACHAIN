import { Card, Typography } from "antd";
import { LoginForm } from "../../forms";

const { Title, Paragraph } = Typography;

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-md">
        <div className="text-center mb-6">
          <Title level={2} className="mb-1">
            Welcome Back
          </Title>
          <Paragraph className="text-gray-500">
            Log in to access your dashboard
          </Paragraph>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
};

export default Login;
