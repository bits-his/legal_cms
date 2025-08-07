"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Drawer, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  BankOutlined,
  MenuOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false); // For Drawer
  const [isMobile, setIsMobile] = useState(false); // Track screen size

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

  const handleResize = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  useEffect(() => {
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) setVisible(false); // Close Drawer on mobile after navigation
  };

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={handleMenuClick}
      items={menuItems}
      className="border-r-0"
    />
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          width={250}
          className="bg-white shadow-sm fixed h-screen left-0 top-0 z-40"
        >
          <div className="border-b border-gray-200" style={{ padding: 17.5 }}>
            <h2 className="text-lg font-bold text-gray-800">
              Prudent Attorneys (AP)
            </h2>
          </div>
          {menu}
        </Sider>
      )}

      {/* Mobile Sidebar - Drawer */}
      {isMobile && (
        <>
          <Drawer
            title="Prudent Attorneys (AP)"
            placement="left"
            closable
            onClose={() => setVisible(false)}
            visible={visible}
            width={250}
            bodyStyle={{ padding: 0 }}
          >
            {menu}
          </Drawer>

          {/* Floating Hamburger Button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="fixed top-4 left-4 z-50 lg:hidden text-xl bg-white shadow-md border rounded-full"
            onClick={() => setVisible(true)}
          />
        </>
      )}
    </>
  );
};

export default Sidebar;
