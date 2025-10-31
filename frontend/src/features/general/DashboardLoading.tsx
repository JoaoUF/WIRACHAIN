import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

interface DashboardLoadingProps {
  tip?: string;
  size?: "small" | "default" | "large";
  fullHeight?: boolean;
}

const DashboardLoading = ({
  tip = "Loading...",
  size = "large",
  fullHeight = true,
}: DashboardLoadingProps) => {
  const loadingIcon = (
    <LoadingOutlined
      style={{
        fontSize: size === "large" ? 48 : size === "default" ? 32 : 24,
        color: "#2f54eb",
      }}
      spin
    />
  );

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullHeight ? "min-h-[calc(100vh-200px)]" : "min-h-[300px]"
      } w-full`}
      style={{ backgroundColor: "transparent" }}
    >
      <Spin indicator={loadingIcon} size={size} tip={tip}>
        <div className="content" />
      </Spin>
    </div>
  );
};

export default DashboardLoading;
