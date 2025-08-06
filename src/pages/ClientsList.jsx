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
import { _get } from "../../Helper";

const { Search } = Input;

export default function ClientsList() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    _get(
      "getClients",
      (res) => {
        if (res.success) {
          setClients(res.data);
        }
      },
      (err) => {
        console.error("Error fetching clients:", err);
      }
    );
  }, []);

  const getActionItems = (record) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View Cases",
      onClick: () => navigate(`/client-cases/${record.client_id}`),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Client",
    },
    {
      key: "Add New Case",
      icon: <PlusOutlined />,
      label: "Add New Case",
      onClick: (() => navigate("/cases/add/" + record.client_id))
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
      render: (text, record) => (
        <>
          <Button
            type="link"
            onClick={() => navigate(`/client-cases/${record.client_id}`)}
          >
            {text.slice(0, 20)}
          </Button>
        </>
      ),
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
