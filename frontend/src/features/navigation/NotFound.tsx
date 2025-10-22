import { Button, Result } from "antd";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/">
            <Button type="primary" size="large">
              Back to Home
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
