"use client";

import type React from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  BankOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/cases",
      label: "Cases Registration",
      icon: <FileTextOutlined />,
    },
    {
      key: "/clients",
      icon: <UserOutlined />,
      label: "Clients Registration",
    },
    {
      key: "/courts",
      icon: <BankOutlined />,
      label: "Courts Registration",
    },
  ];

  return (
    <Sider width={250} className="bg-white shadow-sm flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">
            Prudent Attorneys (AP)
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={["/cases", "/clients"]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className="border-r-0"
          />
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
