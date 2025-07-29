import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Checkbox,
  message,
  Space,
  List,
  Divider,
} from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

export default function AddCase() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [witnesses, setWitnesses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [parties, setParties] = useState([]); // State for the new parties list
  const [newWitness, setNewWitness] = useState("");
  const [newDocument, setNewDocument] = useState("");
  const [newPartyName, setNewPartyName] = useState(""); // State for new party name input
  const [newPartyType, setNewPartyType] = useState(""); // State for new party type select

  // Dummy data for clients and courts
  const courts = [
    {
      id: 1,
      name: "Supreme Court of New York",
      location: "Manhattan",
      address: "60 Centre Street, New York, NY 10007",
      presidingJudge: "Hon. Robert Martinez",
    },
    {
      id: 2,
      name: "Los Angeles Superior Court",
      location: "Downtown LA",
      address: "111 N Hill St, Los Angeles, CA 90012",
      presidingJudge: "Hon. Jennifer Davis",
    },
    {
      id: 3,
      name: "Cook County Circuit Court",
      location: "Chicago",
      address: "50 W Washington St, Chicago, IL 60602",
      presidingJudge: "Hon. William Thompson",
    },
  ];

  const clients = [
    {
      id: 1,
      name: "John Smith",
      phone: "+1-555-0101",
      email: "john.smith@email.com",
      address: "123 Main Street, New York, NY 10001",
      fileNo: "CLT-001",
      date: new Date("2024-01-15"),
    },
    {
      id: 2,
      name: "Sarah Johnson",
      phone: "+1-555-0102",
      email: "sarah.johnson@email.com",
      address: "456 Oak Avenue, Los Angeles, CA 90210",
      fileNo: "CLT-002",
      date: new Date("2024-01-20"),
    },
    {
      id: 3,
      name: "Michael Brown",
      phone: "+1-555-0103",
      email: "michael.brown@email.com",
      address: "789 Pine Road, Chicago, IL 60601",
      fileNo: "CLT-003",
      date: new Date("2024-02-01"),
    },
  ];

  const addWitness = () => {
    if (newWitness.trim()) {
      setWitnesses([...witnesses, newWitness.trim()]);
      setNewWitness("");
    }
  };

  const addDocument = () => {
    if (newDocument.trim()) {
      setDocuments([...documents, newDocument.trim()]);
      setNewDocument("");
    }
  };

  // Function to add a new party to the list
  const addParty = () => {
    if (newPartyName.trim() && newPartyType) {
      setParties([
        ...parties,
        { name: newPartyName.trim(), type: newPartyType },
      ]);
      setNewPartyName(""); // Clear the name input
      setNewPartyType(""); // Clear the type select
    }
  };

  const removeWitness = (index) => {
    setWitnesses(witnesses.filter((_, i) => i !== index));
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  // Function to remove a party from the list
  const removeParty = (index) => {
    setParties(parties.filter((_, i) => i !== index));
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Include the dynamic lists in the values object before sending/logging
      const finalValues = {
        ...values,
        witnesses,
        documents,
        parties, // Add the parties list to the submitted data
      };

      console.log("Form Values Submitted:", finalValues); // Log all data including parties

      // Example API call (uncomment if needed)
      /*
      await axios.post("/api/cases", finalValues);
      message.success("Case added successfully!");
      navigate("/cases");
      */
    } catch (error) {
      message.error("Failed to add case");
      console.error("Error adding case:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Case</h1>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-6"
      >
        <Card className="shadow-sm">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Select Client"
                name="clientId"
                rules={[{ required: true, message: "Please select client" }]}
              >
                <Select placeholder="Select client" showSearch>
                  {clients.map((client) => (
                    <Option key={client.id} value={client.id}>
                      {client.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Select Court"
                name="courtId"
                rules={[{ required: true, message: "Please select court" }]}
              >
                <Select placeholder="Select court" showSearch>
                  {courts.map((court) => (
                    <Option key={court.id} value={court.id}>
                      {court.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Suit No"
                name="suitNo"
                rules={[
                  { required: true, message: "Please enter suit number" },
                ]}
              >
                <Input placeholder="Enter suit number" />
              </Form.Item>
            </Col>

            {/* <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Case Type"
                name="type"
                rules={[{ required: true, message: "Please select type" }]}
              >
                <Select placeholder="Select case type">
                  <Option value="Civil">Civil</Option>
                  <Option value="Criminal">Criminal</Option>
                  <Option value="Family">Family</Option>
                  <Option value="Corporate">Corporate</Option>
                </Select>
              </Form.Item>
            </Col> */}
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={24}>
              <h3 className="font-semibold text-gray-800 mb-3">Add Parties</h3>
              <Space.Compact className="w-full mb-3">
                <Input
                  placeholder="Enter party name"
                  value={newPartyName}
                  onChange={(e) => setNewPartyName(e.target.value)}
                  onPressEnter={addParty}
                  style={{ width: "45%" }}
                  label="Party Name"
                />
                <Select
                  placeholder="Select type"
                  value={newPartyType}
                  onChange={(value) => setNewPartyType(value)}
                  style={{ width: "45%" }}
                  allowClear
                >
                  {/* Options for Party Type */}
                  <Option value="Defendant">Defendant</Option>
                  <Option value="Plaintiff">Plaintiff</Option>
                  <Option value="Adel">Adel</Option>
                  {/* Add more types if needed */}
                </Select>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addParty}
                  disabled={!newPartyName.trim() || !newPartyType} // Disable if name or type is empty
                >
                  Add
                </Button>
              </Space.Compact>
              {/* Display Added Parties List */}
              {parties.length > 0 && (
                <List
                  size="small"
                  header={<div className="font-medium">Added Parties</div>}
                  dataSource={parties}
                  renderItem={(item, index) => (
                    <List.Item
                      key={index}
                      actions={[
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => removeParty(index)}
                        />,
                      ]}
                    >
                      <span className="font-medium">{item.name}</span> -{" "}
                      <span>{item.type}</span>
                    </List.Item>
                  )}
                  className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2"
                />
              )}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label={<span>Subject Matter </span>}
                name="subjectMatter"
                rules={[
                  { required: true, message: "Please enter subject matter" },
                ]}
              >
                <div className="border border-gray-300 rounded-md">
                  <CKEditor
                    editor={ClassicEditor}
                    config={{
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "outdent",
                        "indent",
                        "|",
                        "blockQuote",
                        "insertTable",
                        "undo",
                        "redo",
                      ],
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      form.setFieldsValue({ subjectMatter: data });
                    }}
                  />
                </div>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={<span>Crux of the Matter </span>}
                name="cruxOfMatter"
                rules={[
                  { required: true, message: "Please enter crux of matter" },
                ]}
              >
                <div className="border border-gray-300 rounded-md">
                  <CKEditor
                    editor={ClassicEditor}
                    config={{
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "outdent",
                        "indent",
                        "|",
                        "blockQuote",
                        "insertTable",
                        "undo",
                        "redo",
                      ],
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      form.setFieldsValue({ cruxOfMatter: data });
                    }}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    List of Witnesses
                  </h3>
                  <Space.Compact className="w-full mb-3">
                    <Input
                      placeholder="Add witness name"
                      value={newWitness}
                      onChange={(e) => setNewWitness(e.target.value)}
                      onPressEnter={addWitness}
                    />
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={addWitness}
                      disabled={!witnesses}
                    >
                      Add
                    </Button>
                  </Space.Compact>
                  {witnesses.length > 0 && (
                    <List
                      size="small"
                      dataSource={witnesses}
                      renderItem={(item, index) => (
                        <List.Item
                          key={index}
                          actions={[
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => removeWitness(index)}
                            />,
                          ]}
                        >
                          {item}
                        </List.Item>
                      )}
                      className="max-h-48 overflow-y-auto border border-gray-200 rounded-md"
                    />
                  )}
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    List of Documents
                  </h3>
                  <Space.Compact className="w-full mb-3">
                    <Input
                      placeholder="Add document name"
                      value={newDocument}
                      onChange={(e) => setNewDocument(e.target.value)}
                      onPressEnter={addDocument}
                    />
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      disabled={!documents}
                      onClick={addDocument}
                    >
                      Add
                    </Button>
                  </Space.Compact>
                  {documents.length > 0 && (
                    <List
                      size="small"
                      dataSource={documents}
                      renderItem={(item, index) => (
                        <List.Item
                          key={index}
                          actions={[
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => removeDocument(index)}
                            />,
                          ]}
                        >
                          {item}
                        </List.Item>
                      )}
                      className="max-h-48 overflow-y-auto border border-gray-200 rounded-md"
                    />
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <Divider />
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item label="Expenses" name="expenses">
                <TextArea rows={4} placeholder="Enter case expenses..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Status of the Matter" name="statusOfMatter">
                <div className="border border-gray-300 rounded-md">
                  <CKEditor
                    editor={ClassicEditor}
                    config={{
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "outdent",
                        "indent",
                        "|",
                        "blockQuote",
                        "undo",
                        "redo",
                      ],
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      form.setFieldsValue({ statusOfMatter: data });
                    }}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        {/* <Card title="Case Details" className="shadow-sm">
        
        </Card> */}
        {/* <Card title="Case Management" className="shadow-sm">
         
        </Card> */}
        <div className="flex justify-end space-x-4">
          <Button onClick={() => navigate("/cases")}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Case
          </Button>
        </div>
      </Form>
    </div>
  );
}
