import { useEffect, useState } from "react";
import { Card, Table, Button, Input, Tag, Dropdown } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// import axios from "axios"

const { Search } = Input;

export default function CasesList() {
  const navigate = useNavigate();
  // const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const cases = [
    {
      suitNo: "SUIT-2024-001",
      date: new Date("2024-01-15"),
      // clientId: clients[0].id,
      // courtId: courts[0].id,
      parkcas: "PARK-001",
      type: "Civil",
      subjectMatter:
        "<p>Contract dispute regarding breach of service agreement between parties.</p>",
      cruxOfMatter:
        "<p>The defendant failed to deliver services as per the agreed timeline, causing financial losses to the plaintiff.</p>",
      witnesses: ["Jane Doe", "Robert Wilson"],
      documents: [
        "Service Agreement",
        "Email Communications",
        "Financial Records",
      ],
      expenses:
        "Court fees: $500, Legal research: $1200, Document preparation: $800",
      statusOfMatter:
        "<p>Case filed and served to defendant. Awaiting response.</p>",
      status: "Active",
    },
    {
      suitNo: "SUIT-2024-002",
      date: new Date("2024-01-20"),
      // clientId: clients[1].id,
      // courtId: courts[1].id,
      parkcas: "PARK-002",
      type: "Family",
      subjectMatter: "<p>Child custody and support modification case.</p>",
      cruxOfMatter:
        "<p>Seeking modification of existing custody arrangement due to changed circumstances.</p>",
      witnesses: ["Dr. Amanda Foster", "School Principal"],
      documents: ["Previous Court Order", "School Records", "Medical Records"],
      expenses: "Filing fees: $350, Mediation: $900, Expert witness: $1500",
      statusOfMatter: "<p>Mediation scheduled for next month.</p>",
      status: "Pending",
    },
    {
      suitNo: "SUIT-2024-003",
      date: new Date("2024-02-01"),
      // clientId: clients[2].id,
      // courtId: courts[2].id,
      parkcas: "PARK-003",
      type: "Corporate",
      subjectMatter:
        "<p>Intellectual property infringement case involving trademark violation.</p>",
      cruxOfMatter:
        "<p>Defendant is using plaintiff's registered trademark without authorization, causing brand confusion.</p>",
      witnesses: ["Marketing Director", "Brand Consultant"],
      documents: [
        "Trademark Registration",
        "Marketing Materials",
        "Sales Reports",
      ],
      expenses: "Investigation: $2000, Expert analysis: $3000, Court fees: $750",
      statusOfMatter:
        "<p>Discovery phase in progress. Depositions scheduled.</p>",
      status: "Active",
    },
  ];

  // useEffect(() => {
  //   fetchCases()
  // }, [])

  // const fetchCases = async () => {
  //   setLoading(true)
  //   try {
  //     const response = await axios.get("/api/cases")
  //     setCases(response.data)
  //   } catch (error) {
  //     console.error("Error fetching cases:", error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const getActionItems = (record) => [
  //   {
  //     key: "view",
  //     icon: <EyeOutlined />,
  //     label: "View Details",
  //     onClick: () => navigate(`/cases/${record.id}`),
  //   },
  //   {
  //     key: "edit",
  //     icon: <EditOutlined />,
  //     label: "Edit Case",
  //   },
  //   {
  //     key: "delete",
  //     icon: <DeleteOutlined />,
  //     label: "Delete Case",
  //     danger: true,
  //   },
  // ];

  const columns = [
    {
      title: "Suit No",
      dataIndex: "suitNo",
      key: "suitNo",
      sorter: true,
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      sorter: true,
    },
    {
      title: "Court",
      dataIndex: "courtName",
      key: "courtName",
      sorter: true,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      ellipsis: true,
      width: 200,
    },
    // {
    //   title: "Type",
    //   dataIndex: "type",
    //   key: "type",
    //   render: (type) => (
    //     <Tag
    //       color={
    //         type === "Civil" ? "blue" : type === "Criminal" ? "red" : "green"
    //       }
    //     >
    //       {type}
    //     </Tag>
    //   ),
    // },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (
    //     <Tag
    //       color={
    //         status === "Active"
    //           ? "green"
    //           : status === "Pending"
    //           ? "orange"
    //           : "red"
    //       }
    //     >
    //       {status}
    //     </Tag>
    //   ),
    // },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        // <Dropdown menu={{ items: getActionItems(record) }} trigger={["click"]}>
          <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/cases/${record.id}`)}/>
          // <Button type="text"  onClick={() => navigate(`/cases/${record.id}`)}>View Case</Button>
        // </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">View Cases</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/cases/add")}
          className="w-full sm:w-auto"
        >
          Add New Case
        </Button>
      </div>

      <Card className="shadow-sm">
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <Search
            placeholder="Search by suit no, client, court, or subject..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 400 }}
            prefix={<SearchOutlined />}
          />
        </div>

        <Table
          columns={columns}
          dataSource={cases}
          loading={loading}
          pagination={{
            total: cases.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} cases`,
          }}
          scroll={{ x: 800 }}
          size="middle"
        />
      </Card>
    </div>
  );
}
