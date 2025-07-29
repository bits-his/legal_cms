import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Input } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  BankOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCases: 0,
    totalClients: 0,
    totalCourts: 0,
    pendingCases: 0,
  });
  const [recentCases, setRecentCases] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, casesRes] = await Promise.all([
        axios.get("/api/dashboard/stats"),
        axios.get("/api/cases?limit=5"),
      ]);
      setStats(statsRes.data);
      setRecentCases(casesRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const columns = [
    {
      title: "Suit No",
      dataIndex: "suitNo",
      key: "suitNo",
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Court",
      dataIndex: "courtName",
      key: "courtName",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Cases Dashboard
        </h1>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            onClick={() => navigate("/cases")}
            style={{ cursor: "pointer" }}
          >
            <Statistic
              title="Total Cases"
              value={stats.totalCases}
              prefix={<FileTextOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            onClick={() => navigate("/clients")}
            style={{ cursor: "pointer" }}
          >
            <Statistic
              title="Total Clients"
              value={stats.totalClients}
              prefix={<UserOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            onClick={() => {
              navigate("/courts");
            }}
          >
            <Statistic
              title="Total Courts"
              value={stats.totalCourts}
              prefix={<BankOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card onClick={navigate("/courts/add")}>
            <Statistic
              title="Pending Cases"
              value={stats.pendingCases}
              prefix={<ClockCircleOutlined className="text-orange-500" />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Cases" className="shadow-sm">
        <div className="mb-4">
          <Search
            placeholder="Search cases..."
            allowClear
            style={{ width: 300 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={recentCases}
          pagination={false}
          size="middle"
          className="overflow-x-auto"
        />
      </Card>
    </div>
  );
}
