import type React from "react";
import { Layout, Avatar, Dropdown, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  return (
    <AntHeader
      className="flex justify-between items-center shadow-sm border-b border-gray-200"
      style={{ textAlign: "center", padding: "50px" }}
    >
      <div className="font-semibold text-gray-800" style={{ fontSize: "70px", textAlign: "center", width: "100%", padding: "30px"}}>
        Auwal I Magashi & Co.
      </div>
    </AntHeader>
  );
};

export default Header;
