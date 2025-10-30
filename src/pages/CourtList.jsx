import { useEffect, useState } from "react";
import { Card, Table, Button, Input, Dropdown, Modal } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { _get, _post } from "../../Helper";
import { message } from "antd";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const { Search } = Input;

export default function CourtList() {
  const navigate = useNavigate();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedPDFData, setSelectedPDFData] = useState(null);
  const [courtCases, setCourtCases] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    _get(
      "getCourts",
      (res) => {
        if (res.success) {
          setCourts(res.data);
        }
      },
      (err) => {
        console.error("Error fetching courts:", err);
        message.error("Failed to load courts");
      }
    );
  }, []);

  const downloadPDF = () => {
    // Create a clone of the content to modify for PDF
    const originalContent = document.querySelector(".legal-case-summary");
    const contentClone = originalContent.cloneNode(true);

    // Remove the download button from the clone
    const downloadBtn = contentClone.querySelector(".pdf-download-btn");
    if (downloadBtn) downloadBtn.remove();

    // Add styling specifically for PDF
    contentClone.style.background = "white";
    contentClone.style.width = "100%";
    contentClone.style.boxSizing = "border-box";
    contentClone.style.fontSize = "30px";

    // Temporarily add the clone to the DOM
    contentClone.style.position = "absolute";
    contentClone.style.left = "-9999px";
    document.body.appendChild(contentClone);

    html2canvas(contentClone, {
      scale: 2,
      logging: false,
      useCORS: true,
      letterRendering: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      // Remove the clone
      document.body.removeChild(contentClone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 170; // Reduced width for margins
      const pageHeight = 250; // Reduced height for margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Calculate vertical centering
      const marginLeft = (210 - imgWidth) / 2; // Center horizontally
      let position = 15; // Start 15mm from top

      // Add first page
      pdf.addImage(imgData, "PNG", marginLeft, position, imgWidth, imgHeight);
      let heightLeft = imgHeight - (pageHeight - position);

      // Add additional pages if needed
      while (heightLeft >= 0) {
        pdf.addPage();
        position = -heightLeft + 15; // Maintain 15mm top margin
        pdf.addImage(imgData, "PNG", marginLeft, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Case_Summary_${selectedPDFData.suitNo}.pdf`);
    });
  };

  const handleViewPDF = (record) => {
    setLoading(true);
    _post(
      `getCaseBySuitNo`,
      { suitNo: record.suit_no || record.suitNo },
      (res) => {
        if (res.success) {
          setSelectedPDFData(res.data[0]);
          setShowPDFModal(true);
        } else {
          message.error("Failed to fetch case PDF details");
        }
        setLoading(false);
      },
      () => {
        message.error("Server error while fetching PDF case data");
        setLoading(false);
      }
    );
  };

  const fetchCourtCases = (courtId) => {
    setLoading(true);
    _post(
      "getCaseByCourt",
      { court_id: courtId },
      (res) => {
        if (res.success) {
          const casesData = res.data || [];
          setCourtCases(casesData);
          setSelectedCourt(casesData.length > 0 ? casesData[0].courtName || courtId : courtId);
          setIsModalVisible(true);
        } else {
          message.error(res.message || "Failed to load court cases");
        }
        setLoading(false);
      },
      () => {
        message.error("Failed to load court cases");
        setLoading(false);
      }
    );
  };

  const getActionItems = (record) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View Cases",
      onClick: () => fetchCourtCases(record.court_id),
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

  const modalColumns = [
    {
      title: "Suit No",
      dataIndex: "suit_no",
      key: "suit_no",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => handleViewPDF(record)}
          style={{ padding: 0 }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Client",
      dataIndex: "client_name",
      key: "client_name",
    },
    {
      title: "Client ID",
      dataIndex: "clientId",
      key: "clientId",
    },
    {
      title: "Subject Matter",
      dataIndex: "subject_matter",
      key: "subject_matter",
      render: (text) => (
        <div
          style={{ whiteSpace: "normal", wordWrap: "break-word" }}
          dangerouslySetInnerHTML={{ __html: text?.slice(0, 200) }}
        />
      ),
    },
    {
      title: "Crux of Matter",
      dataIndex: "crux_of_matter",
      key: "crux_of_matter",
      render: (text) => (
        <div
          style={{ whiteSpace: "normal", wordWrap: "break-word" }}
          dangerouslySetInnerHTML={{ __html: text?.slice(0, 200) }}
        />
      ),
    },
    {
      title: "Documents",
      dataIndex: "documents",
      key: "documents",
      render: (docs) => docs?.join(", "),
    },
    {
      title: "Expenses",
      dataIndex: "expenses",
      key: "expenses",
    },
    {
      title: "Status of Matter",
      dataIndex: "status_of_matter",
      key: "status_of_matter",
      render: (text) => (
        <div
          style={{ whiteSpace: "normal", wordWrap: "break-word" }}
          dangerouslySetInnerHTML={{ __html: text?.slice(0, 200) }}
        />
      ),
    },
    {
      title: "View PDF",
      key: "viewPdf",
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewPDF(record)}
        />
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
      {/* {JSON.stringify(courts)} */}
      <Card className="shadow-sm">
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <Search
            placeholder="Search by court name, location, or address..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 400 }}
            prefix={<SearchOutlined />}
          />
        </div>

        <Table
          columns={columns}
          dataSource={courts}
          loading={loading}
          pagination={{
            total: courts?.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} courts`,
          }}
          scroll={{ x: 600 }}
          size="middle"
        />
      </Card>

      <Modal
        title={
          selectedCourt
            ? `${selectedCourt}'s Case Dashboard`
            : "Court Case Dashboard"
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={"90%"}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <Table
              columns={modalColumns}
              dataSource={courtCases}
              pagination={false}
              rowKey="suit_no"
              scroll={{ x: 800 }}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title={`Case File: ${selectedPDFData?.suitNo || "Loading..."}`}
        visible={showPDFModal}
        onCancel={() => setShowPDFModal(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: 1000 }}
      >
        {/* {JSON.stringify(selectedPDFData)} */}
        {selectedPDFData ? (
          <div className="legal-case-summary">
            <h1
              className="text-xl font-bold text-justify mb-6"
              style={{ textDecoration: "underline" }}
            >
              DETAILED SUMMARY OF CASES AT THE HIGH COURT AS AT{" "}
              {new Date()
                .toLocaleString("default", { month: "long" })
                .toUpperCase()}
              , {new Date().getFullYear()}
            </h1>

            <table className="w-full border-collapse mb-6">
              <tbody>
                <tr className="border-gray-300">
                  <td className="font-bold py-2 w-1/4">SUIT NO</td>
                  <td className="py-2">{selectedPDFData.suitNo}</td>
                </tr>
                <tr className="border-gray-300">
                  <td className="font-bold py-2 w-1/4">PARTIES</td>
                  <td className="py-2">{selectedPDFData.client_name}</td>
                </tr>
                <tr className="border-gray-300">
                  <td className="py-2"></td>
                  <td className="py-2">VS.</td>
                </tr>
                {selectedPDFData.parties?.split("\n").map((party, index) => (
                  <tr key={index} className="border-gray-300">
                    <td className="py-2"></td>
                    <td className="py-2">{party}</td>
                  </tr>
                ))}
                <tr className="border-gray-300">
                  <td className="py-2 font-bold">COUNSEL FOR</td>
                  <td className="py-2">{selectedPDFData.client_name}</td>
                </tr>
                <tr className="border-gray-300">
                  <td className="py-2 font-bold">SUBJECT MATTER</td>
                  <td className="py-2">
                    <div
                      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedPDFData.subject_matter || "Not specified",
                      }}
                    />
                  </td>
                </tr>
                <tr className="border-gray-300">
                  <td className="py-2 font-bold">CRUX OF THE MATTER</td>
                  <td className="py-2">
                    <div
                      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedPDFData.crux_of_matter || "Not specified",
                      }}
                    />
                  </td>
                </tr>
                <tr className="border-gray-300">
                  <td className="py-2 font-bold">LIST OF WITNESSES</td>
                  <td className="py-2">
                    <div
                      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                      dangerouslySetInnerHTML={{
                        __html: selectedPDFData.witnesses || "Not specified",
                      }}
                    />
                  </td>
                </tr>
                <tr className="border-gray-300">
                  <td className="py-2 font-bold">LIST OF DOCUMENTS</td>
                  <td className="py-2">
                    <div
                      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                      dangerouslySetInnerHTML={{
                        __html: selectedPDFData.documents || "Not specified",
                      }}
                    />
                  </td>
                </tr>
                <tr className="border-gray-300">
                  <td className="py-2 font-bold">EXPENSES</td>
                  <td className="py-2">{selectedPDFData.expenses}</td>
                </tr>
                <tr className="border-gray-300">
                  <td className="py-2 font-bold">
                    STATUS OF THE MATTER THUS FAR.
                  </td>
                  <td className="py-2">
                    <div
                      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedPDFData.statusOfMatter || "Not specified",
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-6 flex justify-end pdf-download-btn">
              <Button type="primary" onClick={downloadPDF}>
                Download PDF
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            {/* <Spin size="large" /> */}
            <p className="mt-4">Loading case data...</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
