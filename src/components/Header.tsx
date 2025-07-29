import type React from "react"
import { Layout, Avatar, Dropdown, Space } from "antd"
import { UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons"

const { Header: AntHeader } = Layout

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
  ]

  return (
    <AntHeader className="flex justify-between items-center px-6 bg-white shadow-sm border-b border-gray-200">
      <div className="text-lg font-semibold text-gray-800">Legal Case Management System</div>
      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
        <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-md transition-colors">
          <Avatar icon={<UserOutlined />} />
          <span className="text-gray-700">John Doe</span>
        </Space>
      </Dropdown>
    </AntHeader>
  )
}

export default Header
