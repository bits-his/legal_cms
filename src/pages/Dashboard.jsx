import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Input, message } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  BankOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { _get } from "../../Helper";

const { Search } = Input;

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCases: 0,
    totalClients: 0,
    totalCourts: 0,
    pendingCases: 0,
  });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);

    // Fetch dashboard stats
    _get(
      "stats",
      (res) => {
        if (res.success) {
          setStats(res.data);
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching dashboard stats:", err);
        message.error("Failed to load dashboard statistics");
        setLoading(false);
      }
    );

    // Fetch recent cases
    _get(
      "recent-cases",
      (res) => {
        if (res.success) {
          const safeData = Array.isArray(res.data) ? res.data : [];
          setRecentCases(safeData);
          setSearchLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching recent cases:", err);
        message.error("Failed to load recent cases");
        setSearchLoading(false);
      }
    );
  };

  const handleSearch = (value) => {
    setSearchLoading(true);
    _get(
      `search-cases?term=${value}&limit=5`,
      (res) => {
        if (res.success) {
          setRecentCases(res.data);
        }
      },
      (err) => {
        console.error("Error searching cases:", err);
        message.error("Search failed");
        setSearchLoading(false);
      }
    );
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
      render: (text) => (
        <div dangerouslySetInnerHTML={{ __html: text || "No subject" }} />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={
            status === "Pending" ? "text-orange-500" : "text-green-500"
          }
        >
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* {JSON.stringify(recentCases)} */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Cases Dashboard
        </h1>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="glass glass-hover bg-white/25 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-green-400/30 transition-all duration-300"
            onClick={() => navigate("/cases")}
            style={{ cursor: "pointer" }}
            loading={loading}
          >
            <Statistic
              title="Total Cases"
              value={stats.totalCases}
              prefix={<FileTextOutlined className="text-green-600 text-xl" />}
              className="text-white"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="glass glass-hover bg-white/25 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-green-400/30 transition-all duration-300"
            onClick={() => navigate("/clients")}
            style={{ cursor: "pointer" }}
            loading={loading}
          >
            <Statistic
              title="Total Clients"
              value={stats.totalClients}
              prefix={<UserOutlined className="text-green-600 text-xl" />}
              className="text-white"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="glass glass-hover bg-white/25 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-green-400/30 transition-all duration-300"
            onClick={() => navigate("/courts")}
            style={{ cursor: "pointer" }}
            loading={loading}
          >
            <Statistic
              title="Total Courts"
              value={stats.totalCourts}
              prefix={<BankOutlined className="text-green-600 text-xl" />}
              className="text-white"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="glass glass-hover bg-white/25 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-green-400/30 transition-all duration-300"
            onClick={() => navigate("/cases?status=pending")}
            style={{ cursor: "pointer" }}
            loading={loading}
          >
            <Statistic
              title="Pending Cases"
              value={stats.pendingCases}
              prefix={<ClockCircleOutlined className="text-green-600 text-xl" />}
              className="text-white"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Cases" className="glass bg-white/25 backdrop-blur-lg border border-white/30 shadow-lg" loading={loading}>
        <div className="mb-4">
          <Search
            placeholder="Search cases..."
            allowClear
            enterButton
            style={{ width: 300 }}
            onSearch={handleSearch}
            loading={searchLoading}
            className="bg-white/50 rounded-lg"
          />
        </div>
        <Table
          columns={columns}
          dataSource={recentCases}
          pagination={false}
          size="middle"
          className="overflow-x-auto bg-white/30 rounded-lg"
          loading={searchLoading}
          rowKey={(record, index) => index}
          onRow={(record) => ({
            onClick: () => navigate(`/cases/${record.suitNo}`),
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </div>
  );
}
