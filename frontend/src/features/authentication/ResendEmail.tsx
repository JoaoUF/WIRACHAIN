import { CheckCircleOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";
import { Link, useLocation } from "react-router";
import { globalMessage } from "../../contexts/MessageProvider";
import { useLocalStorageEmail } from "../../hooks";
import { useResendEmail } from "../../hooks/useResendEmail";
import { ROUTES } from "../../routers/routes";

const { Title, Paragraph, Text } = Typography;

interface LocationState {
  email?: string;
}

function ResendEmail() {
  const location = useLocation();
  const state = (location.state || {}) as LocationState;
  const { email: storedEmail, clearRegisterEmail } = useLocalStorageEmail();
  const email = state.email ?? storedEmail;
  const { handleResendEmail, isLoading } = useResendEmail();

  const onResendClick = async () => {
    if (!email) {
      globalMessage.warning("No email available to resend to.");
      return;
    }
    await handleResendEmail(email);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-lg shadow-md" bordered={false}>
        <div style={{ textAlign: "center", padding: "28px 12px" }}>
          <Space direction="vertical" size="middle" align="center">
            <CheckCircleOutlined style={{ fontSize: 56, color: "#52c41a" }} />
            <Title level={3} style={{ margin: 0 }}>
              Check your email
            </Title>
            <Paragraph type="secondary" style={{ maxWidth: 520 }}>
              We sent a confirmation email to{" "}
              {email ? (
                <Text strong>{email}</Text>
              ) : (
                <Text strong>the address you provided</Text>
              )}
              . Please open that email and click the confirmation link to
              activate your account.
            </Paragraph>

            <div
              style={{
                display: "flex",
                gap: 12,
                width: "100%",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <Link
                to={ROUTES.LOGIN}
                onClick={clearRegisterEmail}
                style={{ width: 140 }}
              >
                <Button type="default" block>
                  Back to login
                </Button>
              </Link>

              <Button
                type="primary"
                onClick={onResendClick}
                loading={isLoading}
                block
                style={{ width: 160 }}
              >
                <MailOutlined style={{ marginRight: 8 }} />
                Resend email
              </Button>
            </div>

            <Paragraph type="secondary" style={{ marginTop: 8, fontSize: 13 }}>
              Didn't receive the email? Check spam/junk folders or try
              resending. If the problem persists, contact support.
            </Paragraph>
          </Space>
        </div>
      </Card>
    </div>
  );
}

export default ResendEmail;
