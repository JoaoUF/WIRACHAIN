import { Layout, Menu } from "antd";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { ROUTES } from "../routers/routes";

const { Header, Content } = Layout;

const MainMenu = () => {
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);

  const onMenuClick = (path: string) => {
    setCurrent(path);
  };

  return (
    <Layout className="min-h-screen">
      <Header className="px-0 bg-white shadow-md">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto px-4">
          <div className="flex items-center">
            {/* Logo and Left-aligned menu items */}
            <div className="text-xl font-bold mr-6">
              <Link to={ROUTES.ROOT} onClick={() => onMenuClick(ROUTES.ROOT)}>
                Wirachain
              </Link>
            </div>
          </div>

          {/* Right-aligned menu items */}
          <Menu
            mode="horizontal"
            selectedKeys={[current]}
            className="border-none"
            items={[
              {
                key: "/login",
                label: (
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={() => onMenuClick(ROUTES.LOGIN)}
                  >
                    Login
                  </Link>
                ),
              },
              {
                key: "/register",
                label: (
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={() => onMenuClick(ROUTES.REGISTER)}
                  >
                    Register
                  </Link>
                ),
              },
            ]}
          />
        </div>
      </Header>
      <Content className="p-6 max-w-[1200px] mx-auto w-full">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainMenu;
