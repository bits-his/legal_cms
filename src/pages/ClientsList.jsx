import { useEffect, useState } from "react";
import { Card, Table, Button, Input, Dropdown } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Search } = Input;

const clients = [
  {
    name: "John Smith",
    phone: "+1-555-0101",
    email: "john.smith@email.com",
    address: "123 Main Street, New York, NY 10001",
    fileNo: "CLT-001",
    date: new Date("2024-01-15"),
  },
  {
    name: "Sarah Johnson",
    phone: "+1-555-0102",
    email: "sarah.johnson@email.com",
    address: "456 Oak Avenue, Los Angeles, CA 90210",
    fileNo: "CLT-002",
    date: new Date("2024-01-20"),
  },
  {
    name: "Michael Brown",
    phone: "+1-555-0103",
    email: "michael.brown@email.com",
    address: "789 Pine Road, Chicago, IL 60601",
    fileNo: "CLT-003",
    date: new Date("2024-02-01"),
  },
];
export default function ClientsList() {
  const navigate = useNavigate();
  // const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   fetchClients()
  // }, [])

  // const fetchClients = async () => {
  //   setLoading(true)
  //   try {
  //     const response = await axios.get("/api/clients")
  //     setClients(response.data)
  //   } catch (error) {
  //     console.error("Error fetching clients:", error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const getActionItems = (record) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View Cases",
      onClick: () => navigate(`/cases/${record.id}`),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Client",
    },
    // {
    //   key: "delete",
    //   icon: <DeleteOutlined />,
    //   label: "Delete Client",
    //   danger: true,
    // },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Phone No",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "No. Cases",
      dataIndex: "casesCount",
      key: "casesCount",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Dropdown menu={{ items: getActionItems(record) }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Clients Dashboard
          </h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/clients/add")}
          className="w-full sm:w-auto"
        >
          Add Client
        </Button>
      </div>
      {/* {JSON.stringify(clients)} */}
      <Card className="shadow-sm">
        <div className="mb-4">
          <Search
            placeholder="Search clients..."
            allowClear
            style={{ maxWidth: 400 }}
            prefix={<SearchOutlined />}
          />
        </div>

        <Table
          columns={columns}
          dataSource={clients}
          loading={loading}
          pagination={{
            total: clients.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} clients`,
          }}
          scroll={{ x: 600 }}
          size="middle"
        />
      </Card>
    </div>
  );
}
