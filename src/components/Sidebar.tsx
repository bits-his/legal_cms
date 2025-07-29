"use client"

import type React from "react"
import { Layout, Menu } from "antd"
import { useNavigate, useLocation } from "react-router-dom"
import { DashboardOutlined, FileTextOutlined, UserOutlined, BankOutlined, PlusOutlined, LogoutOutlined } from "@ant-design/icons"

const { Sider } = Layout

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/cases",
      label: "View Cases", 
      icon: <FileTextOutlined />,
    },
    // {
    // //   key: "/cases",
    // //   icon: <FileTextOutlined />,
    // //   label: "Cases",
    // //   children: [
    // //     {
    // //       key: "/cases",
    // //       label: "View Cases",
    // //     },
    // //     {
    // //       key: "/cases/add",
    // //       icon: <PlusOutlined />,
    // //       label: "Add Case",
    // //     },
    // //   ],
    // // },
    // {
    //   key: "/clients",
    //   icon: <UserOutlined />,
    //   label: "Clients",
    //   children: [
    //     {
    //       key: "/clients",
    //       label: "View Clients",
    //     },
    //     {
    //       key: "/clients/add",
    //       icon: <PlusOutlined />,
    //       label: "Add Client",
    //     },
    //   ],
    // },
    {
      key: "/clients",
      icon: <UserOutlined />,
      label: "View Clients",
    },
    {
      key: "/courts",
      icon: <BankOutlined />,
      label: "View Courts",
    },
  ]

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    // Example: Clear auth token, redirect to login, etc.
    // localStorage.removeItem('token');
    // navigate('/login');
  };

  return (
    <Sider width={250} className="bg-white shadow-sm flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Legal CMS</h2>
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
      {/* <div className="p-4 border-t border-gray-200 justify-end">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors p-2 rounded hover:bg-red-50"
        >
          <LogoutOutlined />
          <span>Logout</span>
        </button>
      </div> */}
    </Sider>
  )
}

export default Sidebar
