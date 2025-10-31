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
  MessageOutlined,
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
    {
      key: "/case-communication/list",
      icon: <MessageOutlined />,
      label: "Case Communications",
    }
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
      theme="light"
      selectedKeys={[location.pathname]}
      onClick={handleMenuClick}
      items={menuItems}
      className="border-r-0"
      style={{ borderRight: 'none' }}
    />
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          width={250}
          className="glass bg-white/25 backdrop-blur-lg fixed h-screen left-0 top-0 z-40 border-r-2 border-green-500 shadow-xl"
        >
          <div className="border-b-2 border-green-500" style={{ padding: 17.5 }}>
            <h2 className="text-lg font-bold text-green-800" style={{textAlign: "center"}}>
              PASmartSuite
            </h2>
          </div>
          {menu}
        </Sider>
      )}

      {/* Mobile Sidebar - Drawer */}
      {isMobile && (
        <>
          <Drawer
            title={
              <span className="text-green-800 font-bold" style={{textAlign: "center"}}>PASmartSuite</span>
            }
            placement="left"
            closable
            onClose={() => setVisible(false)}
            visible={visible}
            width={250}
            bodyStyle={{ padding: 0 }}
            className="glass bg-white/25 backdrop-blur-lg"
          >
            <div className="glass bg-white/25 backdrop-blur-lg h-full">
              {menu}
            </div>
          </Drawer>

          {/* Floating Hamburger Button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="fixed top-4 left-4 z-50 lg:hidden text-xl bg-green-600 shadow-lg border rounded-full text-white hover:bg-green-700 transition-all duration-300 hover:shadow-green-500/30"
            onClick={() => setVisible(true)}
          />
        </>
      )}
    </>
  );
};

export default Sidebar;
