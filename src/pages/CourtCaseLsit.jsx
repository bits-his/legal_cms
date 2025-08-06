import { useEffect, useState } from "react";
import { Layout, Menu, Input, Button, message } from "antd";
import { SearchOutlined, FilePdfOutlined } from "@ant-design/icons";
import "./CaseDocumentViewer.css";
const { Sider, Content } = Layout;
import { useParams } from "react-router-dom";
import { _get, _post } from "../../Helper";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const CourtCaseList = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [courtCases, setCourtCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const court_id = useParams().id;

  const getCourtCases = () => {
    setLoading(true);
    _post(
      `getCaseByCourt`,
      { court_id },
      (res) => {
        if (res.success) {
          setCourtCases(res.data);
        } else {
          message.error("Failed to fetch court cases");
        }
        setLoading(false);
      },
      () => {
        message.error("Server error while fetching court cases");
        setLoading(false);
      }
    );
  };

  const downloadPDF = (caseData) => {
    const input = document.getElementById(`pdf-content-${caseData.suitNo}`);
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

      pdf.save(`Case_Summary_${caseData.suitNo}.pdf`);
    });
  };

  useEffect(() => {
    getCourtCases();
  }, [court_id]);

  const filteredCases = courtCases.filter(
    (caseItem) =>
      caseItem.suitNo?.toLowerCase().includes(searchText.toLowerCase()) ||
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
          <h3>Court Cases</h3>
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
          selectedKeys={selectedCase ? [selectedCase.suitNo] : []}
          className="case-menu"
          loading={loading}
        >
          {filteredCases.map((caseItem) => (
            <Menu.Item
              key={caseItem.suitNo}
              onClick={() => setSelectedCase(caseItem)}
              className="case-menu-item"
            >
              <div className="case-menu-content">
                <span className="suit-no">{caseItem.suitNo}</span>
                <span className="client-name">{caseItem.client_name}</span>
              </div>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      {/* Main content area */}
      <Layout className="case-content-layout">
        <Content className="case-content">
          {selectedCase ? (
            <div className="document-container">
              <div className="document-header">
                <div>
                  <h1>
                    Court: <b>{selectedCase.court_name}</b>
                  </h1>
                  <h2>
                    Client: <b>{selectedCase.client_name}</b>
                  </h2>
                </div>
                <Button
                  type="primary"
                  onClick={() => downloadPDF(selectedCase)}
                  icon={<FilePdfOutlined />}
                >
                  Download PDF
                </Button>
              </div>

              <div
                id={`pdf-content-${selectedCase.suitNo}`}
                className="pdf-content"
                style={{ padding: "20px" }}
              >
                <h1
                  style={{
                    textAlign: "center",
                    textDecoration: "underline",
                    marginBottom: "20px",
                    fontWeight: "bold",
                  }}
                >
                  CASE DETAILS
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
                      <td style={{ padding: "8px" }}>{selectedCase.suitNo}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        COURT
                      </td>
                      <td style={{ padding: "8px" }}>
                        {selectedCase.court_name}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        DATE
                      </td>
                      <td style={{ padding: "8px" }}>
                        {new Date(selectedCase.date).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        CLIENT
                      </td>
                      <td style={{ padding: "8px" }}>
                        {selectedCase.client_name}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        PARTIES
                      </td>
                      <td style={{ padding: "8px" }}>
                        {selectedCase.parties || "Not specified"}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        SUBJECT MATTER
                      </td>
                      <td style={{ padding: "8px" }}>
                        <div
                          dangerouslySetInnerHTML={renderHTML(
                            selectedCase.subject_matter
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
                            selectedCase.crux_of_matter
                          )}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        STATUS
                      </td>
                      <td style={{ padding: "8px" }}>
                        <div
                          dangerouslySetInnerHTML={renderHTML(
                            selectedCase.statusOfMatter
                          )}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        WITNESSES
                      </td>
                      <td style={{ padding: "8px" }}>
                        {selectedCase.witnesses || "Not specified"}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "8px" }}>
                        DOCUMENTS
                      </td>
                      <td style={{ padding: "8px" }}>
                        {selectedCase.documents || "Not specified"}
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
                <p>Click on any case to display the full details</p>
              </div>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CourtCaseList;
