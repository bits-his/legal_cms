import { useEffect, useState } from "react";
import { Layout, Menu, Input, Button, message, Drawer } from "antd";
import {
  SearchOutlined,
  FilePdfOutlined,
  MenuUnfoldOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { _get, _post } from "../../Helper";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./CaseDocumentViewer.css";

const { Sider, Content } = Layout;

const CaseDocumentViewer = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [clientCases, setClientCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const clientId = useParams().id;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          if (isMobile) setMobileSidebarVisible(false);
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

  const renderSidebarContent = () => (
    <>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Client Cases</h3>
        <Input
          placeholder="Search cases..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="case-search mt-2"
          allowClear
        />
      </div>
      <Menu
        mode="inline"
        selectedKeys={selectedCase ? [selectedCase.key] : []}
        className="case-menu"
      >
        {filteredCases.map((caseItem) => (
          <Menu.Item
            key={caseItem.key}
            onClick={() => handleViewPDF(caseItem)}
            className="case-menu-item"
          >
            <div className="case-menu-content">
              <span className="suit-no font-medium">{caseItem.suit_no}</span>
              <span className="case-title text-sm text-gray-600 truncate">
                {caseItem.title}
              </span>
            </div>
          </Menu.Item>
        ))}
      </Menu>
    </>
  );

  return (
    <Layout className="case-document-layout min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center p-3 shadow-sm bg-white sticky top-0 z-50">
        <Button
          type="text"
          icon={
            mobileSidebarVisible ? <CloseOutlined /> : <MenuUnfoldOutlined />
          }
          onClick={() => setMobileSidebarVisible(!mobileSidebarVisible)}
          className="mr-2"
        />
        <h1 className="text-lg font-semibold truncate">
          {selectedCase?.client_name || "Client Cases"}
        </h1>
      </div>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          width={280}
          className="case-sider hidden lg:block bg-white border-r"
          theme="light"
        >
          {renderSidebarContent()}
        </Sider>
      )}

      {/* Mobile Drawer */}
      <Drawer
        title="Client Cases"
        placement="left"
        open={mobileSidebarVisible}
        onClose={() => setMobileSidebarVisible(false)}
        width={280}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ padding: 16 }}
      >
        {renderSidebarContent()}
      </Drawer>

      {/* Main Content */}
      <Layout className="case-content-layout ml-0">
        <Content className="case-content p-4 md:p-6">
          {selectedCase && selectedPDFData ? (
            <div className="document-container">
              <div className="document-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-xl font-semibold">
                    Client:{" "}
                    <span className="font-normal">
                      {selectedPDFData.client_name}
                    </span>
                  </h1>
                </div>
                <Button
                  type="primary"
                  onClick={downloadPDF}
                  icon={<FilePdfOutlined />}
                  size={isMobile ? "middle" : "large"}
                >
                  Download PDF
                </Button>
              </div>

              <div className="pdf-content bg-white p-4 md:p-6 rounded-lg shadow-sm border">
                <h1 className="text-center underline font-bold mb-6 text-xl">
                  DETAILED SUMMARY OF INFORMATION ON CHAIRMAN'S CASES AT THE
                  HIGH COURT
                </h1>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse mb-4">
                    <tbody>
                      {[
                        ["SUIT NO", selectedPDFData.suitNo],
                        ["PARTIES", selectedPDFData.client_name],
                        ["VS.", "VS."],
                        ...(selectedPDFData.parties
                          ?.split("\n")
                          .map((party) => ["", party]) || []),
                        ["COUNSEL FOR", selectedPDFData.client_name],
                        [
                          "SUBJECT MATTER",
                          <div
                            dangerouslySetInnerHTML={renderHTML(
                              selectedPDFData.subject_matter
                            )}
                          />,
                        ],
                        [
                          "CRUX OF THE MATTER",
                          <div
                            dangerouslySetInnerHTML={renderHTML(
                              selectedPDFData.crux_of_matter
                            )}
                          />,
                        ],
                        [
                          "LIST OF WITNESSES",
                          <div
                            dangerouslySetInnerHTML={renderHTML(
                              selectedPDFData.witnesses
                            )}
                          />,
                        ],
                        [
                          "LIST OF DOCUMENTS",
                          <div
                            dangerouslySetInnerHTML={renderHTML(
                              selectedPDFData.documents
                            )}
                          />,
                        ],
                        [
                          "EXPENSES",
                          selectedPDFData.expenses || "Not specified",
                        ],
                        [
                          "STATUS OF THE MATTER THUS FAR",
                          <div
                            dangerouslySetInnerHTML={renderHTML(
                              selectedPDFData.status_of_matter
                            )}
                          />,
                        ],
                      ].map(([label, value], index) => (
                        <tr key={index} className="border-b">
                          <td className="font-semibold p-2 md:p-3 align-top w-1/3 md:w-1/4">
                            {label}
                          </td>
                          <td className="p-2 md:p-3 align-top">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state text-center p-10 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-medium mb-2">
                Select a case from the sidebar
              </h2>
              <p className="text-gray-600 mb-4">
                Click on any case to display the full details
              </p>
              {isMobile && (
                <Button
                  type="primary"
                  onClick={() => setMobileSidebarVisible(true)}
                >
                  Browse Cases
                </Button>
              )}
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CaseDocumentViewer;
