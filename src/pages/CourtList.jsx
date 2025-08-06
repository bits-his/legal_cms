import { useEffect, useState } from "react";
import { Card, Table, Button, Input, Dropdown } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { _get } from "../../Helper";

const { Search } = Input;
export default function CourtList() {
  const navigate = useNavigate();
  const [courts, seCourts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    _get(
      "getCourts",
      (res) => {
        if (res.success) {
          seCourts(res.data);
        }
      },
      (err) => {
        console.error("Error fetching courts:", err);
      }
    );
  }, []);

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
      label: "Edit Court",
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
            onClick={() => navigate(`/court-cases/${record.court_id}`)}
            style={{ padding: 0, cursor: "pointer" }}
          >
            {text.slice(0, 30)}
            {text.length > 30 && "......."}
          </Button>
        </>
      ),
    },
    {
      title: "Presiding Judge",
      dataIndex: "presidingJudge",
      key: "presidingJudge",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
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
            Courts Dashboard
          </h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/courts/add")}
          className="w-full sm:w-auto"
        >
          Add Courts
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
          dataSource={courts}
          loading={loading}
          pagination={{
            total: courts.length,
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
