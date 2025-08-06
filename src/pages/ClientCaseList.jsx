import { useEffect, useState } from "react";
import { Layout, Menu, Input, Button, Card, message, Modal } from "antd";
import { SearchOutlined, FilePdfOutlined } from "@ant-design/icons";
import "./CaseDocumentViewer.css";
const { Sider, Content } = Layout;
import { useParams } from "react-router-dom";
import { _get, _post } from "../../Helper";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const CaseDocumentViewer = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [clientCases, setClientCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedPDFData, setSelectedPDFData] = useState(null);
  const clientId = useParams().id;

  const fetchClientDetails = () => {
    setLoading(true);
    _get(
      `getClientDetails/${clientId}`,
      (res) => {
        if (res.success) {
          const casesData = res.data || [];
          const casesWithKeys = casesData.map((caseItem, index) => ({
            ...caseItem,
            key: `CS${index + 1}`,
            title: caseItem.subject_matter
              ? caseItem.subject_matter
                  .replace(/<[^>]*>/g, "")
                  .substring(0, 60) + "..."
              : `Case ${caseItem.suit_no}`,
          }));
          setClientCases(casesWithKeys);

          // Auto-select and load first case
          if (casesWithKeys.length > 0) {
            handleViewPDF(casesWithKeys[0]);
          }
        } else {
          message.error(res.message || "Failed to load client details");
        }
        setLoading(false);
      },
      () => {
        message.error("Failed to load client details");
        setLoading(false);
      }
    );
  };

  const handleViewPDF = (record) => {
    setSelectedCase(record);
    setLoading(true);
    _post(
      `getCaseBySuitNo`,
      { suitNo: record.suit_no },
      (res) => {
        if (res.success) {
          setSelectedPDFData(res.data[0]);
          setShowPDFModal(false); // We're showing in main content now
        } else {
          message.error("Failed to fetch case details");
        }
        setLoading(false);
      },
      () => {
        message.error("Server error while fetching case data");
        setLoading(false);
      }
    );
  };

  const downloadPDF = () => {
    const input = document.querySelector(".pdf-content");
    const originalBackground = input.style.background;
    input.style.background = "white";

    html2canvas(input, {
      scale: 2,
      logging: false,
      useCORS: true,
      letterRendering: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      input.style.background = originalBackground;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 170;
      const pageHeight = 250;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 15;

      pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = -heightLeft + 15;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Case_Summary_${selectedPDFData?.suitNo}.pdf`);
    });
  };

  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  const filteredCases = clientCases.filter(
    (caseItem) =>
      caseItem.suit_no?.toLowerCase().includes(searchText.toLowerCase()) ||
      caseItem.subject_matter
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      caseItem.client_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderHTML = (html) => {
    return { __html: html || "Not specified" };
  };

  return (
    <Layout className="case-document-layout">
      {/* Sidebar for suit numbers */}
      <Sider width={250} className="case-sider">
        <div className="sider-header">
          <h3>Case Documents</h3>
          <Input
            placeholder="Search cases..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="case-search"
          />
        </div>

        <Menu
          mode="inline"
          selectedKeys={selectedCase ? [selectedCase.key] : []}
          className="case-menu"
          loading={loading}
        >
          {filteredCases.map((caseItem) => (
            <Menu.Item
              key={caseItem.key}
              onClick={() => handleViewPDF(caseItem)}
              className="case-menu-item"
            >
              <div className="case-menu-content">
                <span className="suit-no">{caseItem.suit_no}</span>
                <span className="case-title">{caseItem.title}</span>
              </div>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      {/* Main content area */}
      <Layout className="case-content-layout">
        <Content className="case-content">
          {selectedPDFData ? (
            <div className="document-container">
              <div className="document-header">
                <h1>Client Name: <b>{selectedPDFData.client_name}</b></h1>
                <Button type="primary" onClick={downloadPDF}>
                  Download PDF
                </Button>
              </div>
              <div className="pdf-content" style={{ padding: "20px" }}>
                <h1
                  style={{
                    textAlign: "center",
                    textDecoration: "underline",
                    marginBottom: "20px",
                    fontWeight: "bold",
                  }}
                >
                  DETAILED SUMMARY OF INFORMATION ON CHAIRMAN'S CASES AT THE
                  HIGH COURT
                </h1>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "20px",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "8px",
                          width: "25%",
                        }}
                      >
                        SUIT NO
                      </td>
                      <td style={{ padding: "8px" }}>
                        {selectedPDFData.suitNo}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        PARTIES
                      </td>
                      <td style={{ padding: "8px" }}>
                        {selectedPDFData.client_name}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px" }}></td>
                      <td style={{ padding: "8px" }}>VS.</td>
                    </tr>
                    {selectedPDFData.parties
                      ?.split("\n")
                      .map((party, index) => (
                        <tr key={index}>
                          <td style={{ padding: "8px" }}></td>
                          <td style={{ padding: "8px" }}>{party}</td>
                        </tr>
                      ))}
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        COUNSEL FOR
                      </td>
                      <td style={{ padding: "8px" }}>
                        {selectedPDFData.client_name}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        SUBJECT MATTER
                      </td>
                      <td style={{ padding: "8px" }}>
                        <div
                          dangerouslySetInnerHTML={renderHTML(
                            selectedPDFData.subject_matter
                          )}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        CRUX OF THE MATTER
                      </td>
                      <td style={{ padding: "8px" }}>
                        <div
                          dangerouslySetInnerHTML={renderHTML(
                            selectedPDFData.crux_of_matter
                          )}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        LIST OF WITNESSES
                      </td>
                      <td style={{ padding: "8px" }}>
                        <div
                          dangerouslySetInnerHTML={renderHTML(
                            selectedPDFData.witnesses
                          )}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        LIST OF DOCUMENTS
                      </td>
                      <td style={{ padding: "8px" }}>
                        <div
                          dangerouslySetInnerHTML={renderHTML(
                            selectedPDFData.documents
                          )}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        EXPENSES
                      </td>
                      <td style={{ padding: "8px" }}>
                        {selectedPDFData.expenses || "Not specified"}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        STATUS OF THE MATTER THUS FAR
                      </td>
                      <td style={{ padding: "8px" }}>
                        <div
                          dangerouslySetInnerHTML={renderHTML(
                            selectedPDFData.status_of_matter
                          )}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div className="empty-state">
                <h2>Select a case from the sidebar to view details</h2>
                <p>
                  Click on any suit number to display the full case document
                </p>
              </div>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CaseDocumentViewer;
