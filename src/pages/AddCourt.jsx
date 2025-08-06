import { useState } from "react";
import { Card, Form, Input, Button, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import { _post } from "../../Helper";

const { TextArea } = Input;

export default function AddCourt() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    _post(
      "addCourt",
      values,
      (res) => {
        if (res.success) {
          message.success("Court added successfully!");
          navigate("/courts");
          setLoading(false);
        }
      },
      (err) => {
        message.error("Failed to add court");
        console.error("Error adding court:", err);
        setLoading(false);
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Add Courts</h1>
      </div>

      <Card className="shadow-sm">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Court Name"
                name="name"
                rules={[{ required: true, message: "Please enter court name" }]}
              >
                <Input placeholder="Enter court name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input placeholder="Enter court location" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ message: "Please enter address" }]}
              >
                <TextArea rows={1} placeholder="Enter court address" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Presiding Judge"
                name="presidingJudge"
                rules={[{ message: "Please enter presiding judge name" }]}
              >
                <Input placeholder="Enter presiding judge name" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-4 mt-6">
            {/* <Button onClick={() => form.resetFields()}>Reset</Button> */}
            <Button onClick={() => navigate("/courts")}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              SAVE
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
