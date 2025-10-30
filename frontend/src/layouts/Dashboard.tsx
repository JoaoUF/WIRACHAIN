import {
  BellOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Layout,
  Menu,
  Typography,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth, useLogout } from "../hooks";
import { ROUTES } from "../routers/routes";
import { USER_TYPES } from "../types";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const ensureIcon = (icon?: React.ReactNode) => icon ?? <DashboardOutlined />;

type Item = Exclude<Required<MenuProps>["items"][number], null | undefined>;

const Dashboard = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileDrawerOpen]);

  const commonMenuItems: Item[] = useMemo(
    () => [
      {
        key: "dashboard",
        icon: ensureIcon(<DashboardOutlined />),
        label: <Link to={ROUTES.DASHBOARD}>Dashboard</Link>,
      },
    ],
    []
  );

  const enterpriseMenuItems: Item[] = useMemo(
    () => [
      {
        key: "my-clinics",
        icon: ensureIcon(<MedicineBoxOutlined />),
        label: <Link to={ROUTES.CLINIC}>My Clinics</Link>,
      },
      {
        key: "my-doctors",
        icon: ensureIcon(<MedicineBoxOutlined />),
        label: <Link to={ROUTES.DOCTOR}>My Doctors</Link>,
      },
      {
        key: "my-diseases",
        icon: ensureIcon(<FileTextOutlined />),
        label: <Link to={ROUTES.DISEASE}>My Diseases</Link>,
      },
      {
        key: "my-tests",
        icon: ensureIcon(<FileTextOutlined />),
        label: <Link to={ROUTES.TEST}>My Tests</Link>,
      },
      {
        key: "my-specialities",
        icon: ensureIcon(<FileTextOutlined />),
        label: <Link to={ROUTES.SPECIALITY}>My Specialities</Link>,
      },
    ],
    []
  );

  const doctorMenuItems: Item[] = useMemo(
    () => [
      {
        key: "waiting-list",
        icon: ensureIcon(<UserOutlined />),
        label: <Link to={ROUTES.WAITING_LIST}>Waiting List</Link>,
      },
      {
        key: "appointments",
        icon: ensureIcon(<CalendarOutlined />),
        label: <Link to={ROUTES.APPOINTMENT}>Appointments</Link>,
      },
    ],
    []
  );

  const patientMenuItems: Item[] = useMemo(
    () => [
      {
        key: "my-reservations",
        icon: ensureIcon(<CalendarOutlined />),
        label: <Link to={ROUTES.RESERVATION}>My Reservation</Link>,
      },
      {
        key: "medical-records",
        icon: ensureIcon(<FileTextOutlined />),
        label: <Link to={ROUTES.MEDICAL_RECORD}>Medical Records</Link>,
      },
    ],
    []
  );

  const roleSpecificMenuItems: Item[] = useMemo(() => {
    switch (user?.groups) {
      case USER_TYPES.DOCTOR:
        return doctorMenuItems;
      case USER_TYPES.PATIENT:
        return patientMenuItems;
      case USER_TYPES.ENTERPRISE_BASIC:
      case USER_TYPES.ENTERPRISE_PREMIUM:
      case USER_TYPES.ENTERPRISE_PROFESSIONAL:
        return enterpriseMenuItems;
      default:
        return [];
    }
  }, [user?.groups, doctorMenuItems, patientMenuItems, enterpriseMenuItems]);

  const menuItems: Item[] = useMemo(() => {
    const isItem = (v: unknown): v is Item =>
      !!v && typeof v === "object" && "key" in v;
    const first = commonMenuItems.filter(
      (i): i is Item => isItem(i) && i.key === "dashboard"
    );
    const restCommon = commonMenuItems.filter(
      (i): i is Item => isItem(i) && i.key !== "dashboard"
    );
    return [...first, ...roleSpecificMenuItems, ...restCommon];
  }, [commonMenuItems, roleSpecificMenuItems]);

  const userDropdown: MenuProps = useMemo(
    () => ({
      items: [
        {
          key: "profile",
          icon: <UserOutlined />,
          label: "Profile",
          onClick: () => navigate(ROUTES.PROFILE),
        },
        {
          key: "settings",
          icon: <SettingOutlined />,
          label: "Settings",
          onClick: () => navigate(ROUTES.SETTING),
        },
        { type: "divider" },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Logout",
          onClick: () => {
            handleLogout();
          },
        },
      ],
    }),
    [handleLogout, navigate]
  );

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const getSelectedKeys = (): string[] => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return ["dashboard"];

    for (let i = parts.length - 1; i >= 0; i--) {
      const segment = parts[i];
      const found = menuItems.find((mi) => String(mi.key) === segment);
      if (found) return [String(found.key)];
    }
    return ["dashboard"];
  };

  const selectedKeys = getSelectedKeys();

  const displayName = user.email.split("@")[0];
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const getPanelTitle = () => {
    if (user.groups === USER_TYPES.DOCTOR) return "Doctor Panel";
    if (user.groups === USER_TYPES.PATIENT) return "Patient Portal";
    return "Enterprise Panel";
  };

  const getPanelInitial = () => {
    if (user.groups === USER_TYPES.DOCTOR) return "D";
    if (user.groups === USER_TYPES.PATIENT) return "P";
    return "E";
  };

  const sidebarContent = (
    <>
      <div
        className={`p-4 ${
          collapsed ? "text-center" : "flex items-center justify-between"
        }`}
      >
        <div className="text-xl font-bold">
          {collapsed ? getPanelInitial() : getPanelTitle()}
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        style={{ borderRight: 0 }}
        items={menuItems}
        onClick={() => {
          if (isMobile) {
            setMobileDrawerOpen(false);
          }
        }}
      />

      {!collapsed && !isMobile && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex items-center">
            <Avatar style={{ backgroundColor: "#2f54eb" }}>
              {avatarLetter}
            </Avatar>
            <div className="ml-2 overflow-hidden">
              <Text strong className="block text-sm truncate">
                {displayName}
              </Text>
              <Text className="block text-xs text-gray-500 truncate">
                {String(user.groups)}
              </Text>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={256}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
          theme="light"
          className="shadow-md"
        >
          {sidebarContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        closable={false}
        width={256}
        styles={{ body: { padding: 0 } }}
      >
        {sidebarContent}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center">
            <Avatar style={{ backgroundColor: "#2f54eb" }}>
              {avatarLetter}
            </Avatar>
            <div className="ml-2 overflow-hidden">
              <Text strong className="block text-sm truncate">
                {displayName}
              </Text>
              <Text className="block text-xs text-gray-500 truncate">
                {String(user.groups)}
              </Text>
            </div>
          </div>
        </div>
      </Drawer>

      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 256,
          transition: "all 0.2s",
        }}
      >
        <Header
          className="p-0 bg-white shadow-sm flex items-center justify-between"
          style={{ position: "sticky", top: 0, zIndex: 1 }}
        >
          <Button
            type="text"
            icon={
              isMobile ? (
                <MenuUnfoldOutlined />
              ) : collapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )
            }
            onClick={() => {
              if (isMobile) {
                setMobileDrawerOpen(true);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="ml-4"
            size="large"
          />

          <div className="flex items-center mr-4 md:mr-6">
            <Button
              type="text"
              icon={<BellOutlined />}
              size="large"
              className="mr-2 md:mr-4"
            />
            <Dropdown menu={userDropdown} trigger={["click"]}>
              <div className="flex items-center cursor-pointer">
                <Avatar style={{ backgroundColor: "#2f54eb" }}>
                  {avatarLetter}
                </Avatar>
                <span className="mr-1 ml-2 hidden sm:inline">
                  {displayName}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          className="p-4 md:p-6 bg-gray-50"
          style={{ minHeight: "calc(100vh - 64px)" }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
