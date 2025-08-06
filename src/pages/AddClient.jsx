import { useState } from "react";
import { Card, Form, Input, Button, Row, Col, DatePicker, message } from "antd";
import { useNavigate } from "react-router-dom";
import { _post } from "../../Helper";

const { TextArea } = Input;

export default function AddClient() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    _post(
      "clients",
      values,
      (res) => {
        if (res.success) {
          message.success("Client added successfully!");
          navigate("/clients");
          setLoading(false);
        }
      },
      (err) => {
        message.error("Failed to add client");
        console.error("Error adding client:", err);
        setLoading(false);
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Add Client Form
        </h1>
      </div>

      <Card className="shadow-sm">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="File No"
                name="fileNo"
                rules={[
                  { required: true, message: "Please enter file number" },
                ]}
              >
                <Input placeholder="Enter file number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter client name" },
                ]}
              >
                <Input placeholder="Enter client name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ message: "Please enter address" }]}
              >
                <TextArea rows={1} placeholder="Enter client address" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { message: "Please enter email" },
                  { type: "email", message: "Please enter valid email" },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-4 mt-6">
            <Button onClick={() => navigate("/clients")}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              SAVE
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
