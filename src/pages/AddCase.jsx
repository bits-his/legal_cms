import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Space,
  List,
  Divider,
  message,
} from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { _get, _post } from "../../Helper";

const { Option } = Select;
const { TextArea } = Input;

export default function AddCase() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [courts, setCourts] = useState([]);
  const [clients, setClients] = useState([]);

  const [caseData, setCaseData] = useState({
    witnesses: [],
    documents: [],
    parties: [],
    subjectTo: "",
    newWitness: "",
    newDocument: "",
    newPartyName: "",
    newPartyType: "",
    subjectMatter: "",
    cruxOfMatter: "",
    statusOfMatter: "",
    expenses: "",
    suitNo: "",
    date: "",
    clientId: "",
    courtId: "",
  });

  useEffect(() => {
    _get(
      "getCourts",
      (res) => res.success && setCourts(res.data || []),
      () => message.error("Failed to load courts")
    );

    _get(
      "getClients",
      (res) => res.success && setClients(res.data || []),
      () => message.error("Failed to load clients")
    );
  }, []);

  const updateCaseData = (key, value) => {
    setCaseData((prev) => ({ ...prev, [key]: value }));
  };

  const addToList = (key, valueKey) => {
    const value = caseData[valueKey]?.trim();
    if (!value) return message.warning(`Enter a valid ${valueKey}`);
    setCaseData((prev) => ({
      ...prev,
      [key]: [...prev[key], { id: Date.now(), name: value }],
      [valueKey]: "",
    }));
  };

  const addParty = () => {
    const { newPartyName, newPartyType } = caseData;
    if (!newPartyName.trim() || !newPartyType) {
      return message.warning("Enter both party name and type");
    }
    setCaseData((prev) => ({
      ...prev,
      parties: [
        ...prev.parties,
        { id: Date.now(), name: newPartyName.trim(), type: newPartyType },
      ],
      newPartyName: "",
      newPartyType: "",
    }));
  };

  const removeFromList = (key, id) => {
    setCaseData((prev) => {
      const updated = prev[key].filter((item) => item.id !== id);
      return {
        ...prev,
        [key]: updated,
        ...(key === "parties" &&
        prev.subjectTo === updated.find((p) => p.id === id)?.name
          ? { subjectTo: "" }
          : {}),
      };
    });
  };

  const onFinish = (values) => {
    console.log(values);
    setLoading(true);
    const finalData = {
      ...values,
      witnesses: caseData.witnesses.map((w) => w.name),
      documents: caseData.documents.map((d) => d.name),
      parties: caseData.parties,
      subjectTo: caseData.subjectTo,
      subjectMatter: caseData.subjectMatter,
      cruxOfMatter: caseData.cruxOfMatter,
      statusOfMatter: caseData.statusOfMatter,
      expenses: caseData.expenses,
    };

    _post(
      "addCase",
      finalData,
      (res) => {
        if (res.success) {
          message.success("Case added successfully!");
          navigate("/cases");
        } else {
          message.error(res.message || "Failed to add case");
        }
      },
      () => message.error("Error submitting case")
    ).finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      {/* {JSON.stringify(caseData, null, 2)} */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Case</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Select date" }]}
              >
                <DatePicker
                  className="w-full"
                  onChange={(date) => updateCaseData("date", date)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Client"
                name="clientId"
                rules={[{ required: true, message: "Select client" }]}
              >
                <Select
                  placeholder="Select client"
                  onChange={(value) => updateCaseData("clientId", value)}
                >
                  {clients.map((client) => (
                    <Option key={client.client_id} value={client.client_id}>
                      {client.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Court"
                name="courtId"
                rules={[{ required: true, message: "Select court" }]}
              >
                <Select
                  placeholder="Select court"
                  onChange={(value) => updateCaseData("courtId", value)}
                >
                  {courts.map((court) => (
                    <Option key={court.court_id} value={court.court_id}>
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
                rules={[{ required: true, message: "Enter suit number" }]}
              >
                <Input
                  placeholder="Suit number"
                  onChange={(e) => updateCaseData("suitNo", e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Parties */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <h3 className="mb-3 font-medium">Parties</h3>
              <Space.Compact className="w-full mb-3">
                <Input
                  value={caseData.newPartyName}
                  onChange={(e) =>
                    updateCaseData("newPartyName", e.target.value)
                  }
                  placeholder="Party name"
                  style={{ width: "45%" }}
                />
                <Select
                  value={caseData.newPartyType}
                  onChange={(val) => updateCaseData("newPartyType", val)}
                  placeholder="Type"
                  style={{ width: "45%" }}
                >
                  <Option value="Defendant">Defendant</Option>
                  <Option value="Plaintiff">Plaintiff</Option>
                  <Option value="Adel">Adel</Option>
                  <Option value="Other">Other</Option>
                </Select>
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={addParty}
                >
                  Add
                </Button>
              </Space.Compact>
              <List
                size="small"
                bordered
                dataSource={caseData.parties}
                renderItem={(item) => (
                  <List.Item
                    key={`party-${item.id}`}
                    actions={[
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeFromList("parties", item.id)}
                      />,
                    ]}
                  >
                    {item.name} - {item.type}
                  </List.Item>
                )}
              />
              <Form.Item label="Counsel For" name="counselFor">
                <Select
                  value={caseData.subjectTo}
                  onChange={(val) => updateCaseData("subjectTo", val)}
                  placeholder="Select subject"
                >
                  {caseData.parties.map((p) => (
                    <Option key={`subject-${p.id}`} value={p.name}>
                      {p.name} ({p.type})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* CKEditor */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="Subject Matter"
                name="subjectMatter"
                rules={[{ required: true, message: "Enter subject matter" }]}
              >
                <CKEditor
                  editor={ClassicEditor}
                  onChange={(e, editor) =>
                    updateCaseData("subjectMatter", editor.getData())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Crux of Matter"
                name="cruxOfMatter"
              >
                <CKEditor
                  editor={ClassicEditor}
                  onChange={(e, editor) =>
                    updateCaseData("cruxOfMatter", editor.getData())
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Witnesses & Documents */}
          <Row gutter={[16, 16]}>
            <Col md={12}>
              <h3>Witnesses</h3>
              <Space.Compact className="w-full mb-3">
                <Input
                  value={caseData.newWitness}
                  onChange={(e) => updateCaseData("newWitness", e.target.value)}
                  placeholder="Witness name"
                />
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => addToList("witnesses", "newWitness")}
                >
                  Add
                </Button>
              </Space.Compact>
              <List
                dataSource={caseData.witnesses}
                renderItem={(item) => (
                  <List.Item
                    key={`witness-${item.id}`}
                    actions={[
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => removeFromList("witnesses", item.id)}
                      />,
                    ]}
                  >
                    {item.name}
                  </List.Item>
                )}
              />
            </Col>
            <Col md={12}>
              <h3>Documents</h3>
              <Space.Compact className="w-full mb-3">
                <Input
                  value={caseData.newDocument}
                  onChange={(e) =>
                    updateCaseData("newDocument", e.target.value)
                  }
                  placeholder="Document name"
                />
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => addToList("documents", "newDocument")}
                >
                  Add
                </Button>
              </Space.Compact>
              <List
                dataSource={caseData.documents}
                renderItem={(item) => (
                  <List.Item
                    key={`doc-${item.id}`}
                    actions={[
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => removeFromList("documents", item.id)}
                      />,
                    ]}
                  >
                    {item.name}
                  </List.Item>
                )}
              />
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col md={12}>
              <Form.Item label="Expenses" name="expenses">
                <TextArea
                  rows={4}
                  value={caseData.expenses}
                  onChange={(e) => updateCaseData("expenses", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="Status of the Matter" name="statusOfMatter">
                <CKEditor
                  editor={ClassicEditor}
                  onChange={(e, editor) =>
                    updateCaseData("statusOfMatter", editor.getData())
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <div className="flex justify-end mt-6 space-x-4">
          <Button onClick={() => navigate("/cases")}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Case
          </Button>
        </div>
      </Form>
    </div>
  );
}
