import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Space,
  message,
  Tag,
  List,
  Divider,
  Upload,
  Image
} from "antd";
import { UploadOutlined, DeleteOutlined, FilePdfOutlined, FileImageOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { _get, _post } from "../../../Helper";

const { TextArea } = Input;
const { Option } = Select;

export default function CaseCommunicationForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [communicationNote, setCommunicationNote] = useState("");
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Load all cases
    _get(
      "getCases",
      (res) => {
        if (res.success) {
          setCases(res.data || []);
        } else {
          message.error("Failed to load cases");
        }
      },
      () => message.error("Failed to load cases")
    );
  }, []);

  const handleCaseChange = (caseId) => {
    const selected = cases.find(c => c.id === caseId);
    setSelectedCase(selected || null);
  };

  const handleFileUpload = async (file) => {
    setUploading(true);

    try {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload PDF, JPG, or PNG files.');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'nibbes_kitchen_unsigned');

      const response = await fetch('https://api.cloudinary.com/v1_1/dv0gb0cy2/auto/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        // Add the URL to our list
        setUploadedUrls(prev => [...prev, data.secure_url]);
        message.success('File uploaded successfully to Cloudinary');
        return false; // Prevent default upload behavior
      } else {
        throw new Error('Upload failed: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error.message || 'Upload failed');
      return false; // Prevent default upload behavior
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedFile = (urlToRemove) => {
    setUploadedUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleSubmit = () => {
    if (!selectedCase) {
      message.error("Please select a case");
      return;
    }

    setLoading(true);

    const data = {
      caseId: selectedCase.id,
      note: communicationNote,
      documentUrls: uploadedUrls
    };

    _post(
      "api/case-communication/add",
      data,
      (res) => {
        if (res.success) {
          message.success(res.message || "Communication added successfully!");
          navigate("/case-communication/list");
        } else {
          message.error(res.message || "Failed to add communication");
        }
        setLoading(false);
      },
      (error) => {
        message.error("Error submitting communication");
        console.error("Submission error:", error);
        setLoading(false);
      }
    );
  };

  const handleBeforeUpload = (file) => {
    // Return false to prevent default upload behavior since we handle it manually
    handleFileUpload(file);
    return false;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Add Case Communication</h1>
      
      <Form layout="vertical" onFinish={handleSubmit}>
        <Card>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                label="Select Case"
                name="caseId"
                rules={[{ required: true, message: "Please select a case" }]}
              >
                <Select
                  placeholder="Select a case"
                  onChange={handleCaseChange}
                  allowClear
                >
                  {cases.map((caseItem) => (
                    <Option key={caseItem.id} value={caseItem.id}>
                      {caseItem.suitNo} - {caseItem.clientName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Case Summary Card */}
          {selectedCase && (
            <div className="mb-6">
              <Card 
                className="glass bg-white/30 backdrop-blur-lg border border-white/50 shadow-lg"
                title="Selected Case Summary"
              >
                <Row gutter={[16, 8]}>
                  <Col span={24}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Case ID</span>
                        <span className="font-medium">{selectedCase.id}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Suit No</span>
                        <span className="font-medium">{selectedCase.suitNo}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Court</span>
                        <span className="font-medium">{selectedCase.courtName}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Client Name</span>
                        <span className="font-medium">{selectedCase.clientName}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Date</span>
                        <span className="font-medium">{selectedCase.date}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          )}

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                label="Communication Note"
              >
                <TextArea
                  rows={4}
                  placeholder="Enter communication notes..."
                  value={communicationNote}
                  onChange={(e) => setCommunicationNote(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item label="Upload Documents (PDF/Images)">
                <Upload
                  beforeUpload={handleBeforeUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                  showUploadList={false}
                  disabled={uploading}
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    loading={uploading}
                    disabled={uploading}
                  >
                    Click to Upload Documents
                  </Button>
                </Upload>
                <div className="mt-2 text-sm text-gray-600">
                  Supported formats: PDF, JPG, JPEG, PNG. Max size: 10MB
                </div>
              </Form.Item>
            </Col>
          </Row>

          {/* Preview of uploaded files */}
          {Array.isArray(uploadedUrls) && uploadedUrls.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 font-medium">Uploaded Files</h3>
              <List
                size="small"
                dataSource={uploadedUrls}
                renderItem={(url, index) => {
                  const fileName = url.split('/').pop();
                  const isImage = url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png');
                  const isPdf = url.endsWith('.pdf');
                  
                  return (
                    <List.Item
                      key={index}
                      actions={[
                        <Button
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => removeUploadedFile(url)}
                        />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          isImage ? <Image width={40} height={40} src={url} /> : 
                          isPdf ? <FilePdfOutlined style={{ fontSize: '24px', color: '#FF0000' }} /> :
                          <FileImageOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        }
                        title={
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            {fileName}
                          </a>
                        }
                        description={url}
                      />
                    </List.Item>
                  );
                }}
              />
            </div>
          )}
        </Card>

        <div className="flex flex-col sm:flex-row justify-end mt-6 gap-4">
          <Button
            onClick={() => navigate("/case-communication/list")}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            className="w-full sm:w-auto"
          >
            Submit Communication
          </Button>
        </div>
      </Form>
    </div>
  );
}