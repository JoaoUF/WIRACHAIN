import {
  ArrowRightOutlined,
  RocketOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import { Link } from "react-router";
import { ROUTES } from "../../routers/routes";

const { Title, Paragraph } = Typography;

const Landing = () => {
  return (
    <div className="welcome-container py-10">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Title className="text-4xl md:text-5xl mb-6">
          Welcome to Wirachain
        </Title>
        <Paragraph className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          A powerful, all-in-one platform to securely store and share electronic
          health records, manage your medical team, and provide seamless patient
          care.
        </Paragraph>
        <Space size="large">
          <Link to={ROUTES.DASHBOARD}>
            <Button type="primary" size="large">
              View Dashboard <ArrowRightOutlined />
            </Button>
          </Link>
          <Link to={ROUTES.DASHBOARD}>
            <Button size="large">Get Started</Button>
          </Link>
        </Space>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <Title level={2} className="text-center mb-10">
          Key Features
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card
              className="h-full hover:shadow-md transition-shadow text-center"
              cover={
                <div className="flex justify-center pt-8">
                  <RocketOutlined style={{ fontSize: 48, color: "#1890ff" }} />
                </div>
              }
            >
              <Title level={4}>Fast Performance</Title>
              <Paragraph>
                Built with modern technologies for optimal speed and efficiency.
                Experience quick load times and smooth transitions.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              className="h-full hover:shadow-md transition-shadow text-center"
              cover={
                <div className="flex justify-center pt-8">
                  <SettingOutlined style={{ fontSize: 48, color: "#1890ff" }} />
                </div>
              }
            >
              <Title level={4}>Customizable</Title>
              <Paragraph>
                Tailor the dashboard to your needs with flexible components and
                settings that adapt to your workflow.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              className="h-full hover:shadow-md transition-shadow text-center"
              cover={
                <div className="flex justify-center pt-8">
                  <TeamOutlined style={{ fontSize: 48, color: "#1890ff" }} />
                </div>
              }
            >
              <Title level={4}>Collaborative</Title>
              <Paragraph>
                Share insights with team members and work together efficiently
                with built-in collaborative tools.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Call to Action */}
      <Card className="bg-blue-50 border-blue-100">
        <div className="text-center py-4">
          <Title level={3}>Ready to get started?</Title>
          <Paragraph className="mb-6">
            Join thousands of users who are already improving their workflow.
          </Paragraph>
          <Space>
            <Link to={ROUTES.REGISTER}>
              <Button type="primary" size="large">
                Create Free Account
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button size="large">Sign In</Button>
            </Link>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Landing;
