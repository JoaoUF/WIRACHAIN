import { Button, Result } from "antd";
import { Link } from "react-router";
import { ROUTES } from "../../routers/routes";

function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Link to={ROUTES.ROOT}>
            <Button type="primary" size="large">
              Back to Home
            </Button>
          </Link>
        }
      />
    </div>
  );
}

export default NotAuthorized;
