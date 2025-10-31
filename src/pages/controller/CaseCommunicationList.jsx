import { useState, useEffect } from "react";
import { Card, Table, Button, Tag, Space, message } from "antd";
import { PlusOutlined, FilePdfOutlined, FileImageOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { _get } from "../../../Helper";

export default function CaseCommunicationList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [communications, setCommunications] = useState([]);

  useEffect(() => {
    fetchCommunications();
  }, []);

  const fetchCommunications = () => {
    setLoading(true);
    _get(
      "api/case-communication/list",
      (res) => {
        if (res.success) {
          setCommunications(res.data || []);
        } else {
          message.error(res.message || "Failed to fetch communications");
        }
        setLoading(false);
      },
      (error) => {
        message.error("Error fetching communications");
        console.error("Fetch error:", error);
        setLoading(false);
      }
    );
  };

  const columns = [
    {
      title: "Case ID",
      dataIndex: ["case", "id"],
      key: "caseId",
      sorter: true,
    },
    {
      title: "Case Name",
      key: "caseName",
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.case?.suitNo}</div>
          <div className="text-sm text-gray-600">{record.case?.clientName}</div>
        </div>
      ),
      sorter: true,
    },
    {
      title: "Note Preview",
      dataIndex: "note",
      key: "note",
      render: (text) => (
        <div>
          {text ? (
            <div dangerouslySetInnerHTML={{ __html: (typeof text === 'string' && text.length > 100) ? text.substring(0, 100) + "..." : text }} />
          ) : (
            <span className="text-gray-500">No note provided</span>
          )}
        </div>
      ),
    },
    {
      title: "Documents",
      key: "documents",
      render: (_, record) => {
        // Handle both array and string formats for documentUrls
        let documentUrls = record.documentUrls;
        
        // If documentUrls is a string, parse it as JSON
        if (typeof documentUrls === 'string') {
          try {
            documentUrls = JSON.parse(documentUrls);
          } catch (e) {
            console.error('Error parsing documentUrls:', e);
            documentUrls = [];
          }
        }
        
        // Ensure it's an array
        if (!Array.isArray(documentUrls)) {
          documentUrls = [];
        }
        
        if (!documentUrls || documentUrls.length === 0) {
          return <Tag color="default">No documents</Tag>;
        }
        
        return (
          <Space size="small" wrap>
            {documentUrls.map((url, index) => {
              const isImage = url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png');
              const isPdf = url.endsWith('.pdf');
              
              return (
                <a 
                  key={index}
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  {isImage ? (
                    <FileImageOutlined style={{ color: '#1890ff', marginRight: 4 }} />
                  ) : isPdf ? (
                    <FilePdfOutlined style={{ color: '#FF0000', marginRight: 4 }} />
                  ) : (
                    <FileImageOutlined style={{ color: '#1890ff', marginRight: 4 }} />
                  )}
                  <span className="text-xs">Doc {index + 1}</span>
                </a>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              // Open all document URLs in new tabs
              if (record.documentUrls && record.documentUrls.length > 0) {
                record.documentUrls.forEach(url => {
                  window.open(url, '_blank');
                });
              } else {
                message.info('No documents to open');
              }
            }}
          >
            View Docs
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Case Communications</h1>
          <p className="text-gray-600">Manage all case communications and documents</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/case-communication/add")}
          className="w-full sm:w-auto"
        >
          Add Communication
        </Button>
      </div>

      <Card className="glass bg-white/25 backdrop-blur-lg border border-white/30 shadow-lg">
        <Table
          columns={columns}
          dataSource={communications}
          loading={loading}
          rowKey="id"
          pagination={{
            total: communications?.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} communications`,
          }}
          scroll={{ x: 800 }}
          size="middle"
          className="bg-white/30 rounded-lg"
        />
      </Card>
    </div>
  );
}