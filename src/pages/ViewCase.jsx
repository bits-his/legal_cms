import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  List,
  Space,
  Tag,
  Divider,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useParams } from "react-router-dom";

const { TextArea } = Input;

export default function ViewCases() {
  const { id } = useParams();
  const [form] = Form.useForm();
  // const [caseData, setCaseData] = useState(null);
  const [witnesses, setWitnesses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [newWitness, setNewWitness] = useState("");
  const [newDocument, setNewDocument] = useState("");
  const caseData = [
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
  ];
  // useEffect(() => {
  //   if (id) {
  //     fetchCaseData()
  //   }
  // }, [id])

  // const fetchCaseData = async () => {
  //   try {
  //     const response = await axios.get(`/api/cases/${id}`)
  //     setCaseData(response.data)
  //     setWitnesses(response.data.witnesses || [])
  //     setDocuments(response.data.documents || [])
  //     form.setFieldsValue(response.data)
  //   } catch (error) {
  //     console.error("Error fetching case data:", error)
  //   }
  // }

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

  const removeWitness = (index) => {
    setWitnesses(witnesses.filter((_, i) => i !== index));
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  if (!caseData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Case Details - {caseData.suitNo}
          </h1>
          <div className="flex space-x-4">
            <Tag color="blue">{caseData.type}</Tag>
            <Tag color={caseData.status === "Active" ? "green" : "orange"}>
              {caseData.status}
            </Tag>
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Case Information" className="shadow-sm h-full">
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-gray-700">Client:</label>
                <p className="text-gray-600">{caseData.clientName}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Court:</label>
                <p className="text-gray-600">{caseData.courtName}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Date:</label>
                <p className="text-gray-600">{caseData.date}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">
                  Subject Matter:
                </label>
                <div
                  className="text-gray-600 mt-2 p-3 bg-gray-50 rounded-md"
                  dangerouslySetInnerHTML={{ __html: caseData.subjectMatter }}
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Additional Details" className="shadow-sm h-full">
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-gray-700">
                  Crux of Matter:
                </label>
                <div
                  className="text-gray-600 mt-2 p-3 bg-gray-50 rounded-md"
                  dangerouslySetInnerHTML={{ __html: caseData.cruxOfMatter }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Case Management" className="shadow-sm">
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
                  >
                    Add
                  </Button>
                </Space.Compact>
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
                    onClick={addDocument}
                  >
                    Add
                  </Button>
                </Space.Compact>
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
              </div>
            </div>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item label="Expenses">
              <TextArea
                rows={4}
                placeholder="Enter case expenses..."
                defaultValue={caseData.expenses}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span>
                  Status of the Matter{" "}
                  <span className="text-red-500">(CKEditor)</span>
                </span>
              }
            >
              <div className="border border-gray-300 rounded-md">
                <CKEditor
                  editor={ClassicEditor}
                  data={caseData.statusOfMatter || ""}
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
                />
              </div>
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end space-x-4 mt-6">
          <Button type="primary">Update Case</Button>
        </div>
      </Card>
    </div>
  );
}
