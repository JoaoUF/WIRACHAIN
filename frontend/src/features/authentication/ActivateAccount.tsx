import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Grid, Result, Space, Spin, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { useVerifyEmail } from "../../hooks";
import { ROUTES } from "../../routers/routes";
import type { verifyEmailRequest } from "../../types";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

/**
 * ActivateAccount
 *
 * Simple, robust activation page:
 * - uses isError (boolean) from the hook and displays a basic error text when true
 * - prevents repeated verification calls using a ref (calledRef)
 * - supports retry by resetting the ref before attempting again
 * - responsive layout using Ant Design breakpoints
 */
export default function ActivateAccount() {
  const { key } = useParams<{ key?: string }>();
  const { handleVerifyEmail, isLoading, isError } = useVerifyEmail();
  const screens = useBreakpoint();

  const [attempted, setAttempted] = useState(false);
  const [noKey, setNoKey] = useState(false);

  // prevents multiple automatic calls (e.g. caused by repeated re-renders)
  const calledRef = useRef(false);

  const doVerify = useCallback(
    async (k?: string) => {
      if (!k) {
        setNoKey(true);
        return;
      }
      // avoid duplicate attempts
      if (calledRef.current) return;
      if (isLoading) return;

      calledRef.current = true;
      setAttempted(true);

      await handleVerifyEmail({ key: k } as verifyEmailRequest);
    },
    [handleVerifyEmail, isLoading]
  );

  useEffect(() => {
    doVerify(key);
  }, [key, doVerify]);

  const handleRetry = () => {
    // allow another attempt
    calledRef.current = false;
    setAttempted(false);
    doVerify(key);
  };

  const titleLevel = screens.xs ? 4 : screens.sm ? 3 : 2;
  const cardPadding = screens.xs ? "18px" : "28px";

  if (noKey) {
    return (
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-lg shadow-md" bordered={false}>
          <Result
            status="warning"
            title="Activation key missing"
            subTitle="We couldn't find an activation key in the link. Please check the link in your email or request a new confirmation email."
            extra={[
              <Link key="login" to={ROUTES.LOGIN}>
                <Button>Back to login</Button>
              </Link>,
              <Link key="resend" to={ROUTES.RESEND_EMAIL}>
                <Button type="primary">Resend confirmation</Button>
              </Link>,
            ]}
          />
        </Card>
      </div>
    );
  }

  if (isLoading || (!attempted && !isError)) {
    return (
      <div className="flex justify-center items-center py-12">
        <Card
          className="w-full max-w-lg shadow-md"
          bordered={false}
          style={{ padding: cardPadding }}
        >
          <Space
            direction="vertical"
            size="large"
            style={{ width: "100%", textAlign: "center" }}
          >
            <Spin size="large" />
            <Title level={titleLevel} style={{ margin: 0 }}>
              Verifying your account...
            </Title>
            <Paragraph type="secondary">
              This should only take a moment. You will be redirected when
              verification completes.
            </Paragraph>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-lg shadow-md" bordered={false}>
        {isError ? (
          <Result
            icon={<ExclamationCircleOutlined style={{ color: "#faad14" }} />}
            title="Verification failed"
            subTitle="Something went wrong!"
            extra={[
              <Button
                key="retry"
                type="primary"
                onClick={handleRetry}
                loading={isLoading}
              >
                Retry verification
              </Button>,
              <Link key="resend" to={ROUTES.RESEND_EMAIL}>
                <Button>Resend confirmation</Button>
              </Link>,
              <Link key="login" to={ROUTES.LOGIN}>
                <Button>Back to login</Button>
              </Link>,
            ]}
          />
        ) : (
          <Result
            icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            title="Account verified"
            subTitle="Your email has been verified. If you are not redirected automatically, proceed to login."
            extra={[
              <Link key="login" to={ROUTES.LOGIN}>
                <Button type="primary">Go to login</Button>
              </Link>,
            ]}
          />
        )}
      </Card>
    </div>
  );
}
