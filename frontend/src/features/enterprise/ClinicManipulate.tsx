import { MailOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Space, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  CitySelect,
  CountrySelect,
  RegionSelect,
  TransferClinicSpeciality,
} from "../../componenets";
import { useClinicManager } from "../../hooks";
import type { ClinicRequest } from "../../types/Clinic";

const { TabPane } = Tabs;

function ClinicManipulate() {
  const { addClinic, addState } = useClinicManager();
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm<ClinicRequest>();

  // Keep a small piece of local state for country/region so dependent selects
  // receive immediate prop updates (avoids timing issues when reading form values).
  const [countryId, setCountryId] = useState<number | null>(null);
  const [regionId, setRegionId] = useState<number | null>(null);

  // track the clinic id after creation or from params; used to enable tabs
  const [clinicId, setClinicId] = useState<string | null>(id ?? null);

  const onFinish = async (record: ClinicRequest) => {
    console.log(record);
    // unwrap result and try to read the created/updated clinic id
    const res = await addClinic(record).unwrap();
    // expect the response contains an `id` field (UUID/string)
    if (res && (res as any).id) {
      setClinicId(String((res as any).id));
    }
  };

  useEffect(() => {
    if (id) {
      // insert get clinic by id later
      // set initial clinic id so tabs enable when editing an existing clinic
      setClinicId(id);
      void id;
    }
  }, [id]);

  // When country changes: update form and local state and clear dependent fields
  const handleCountryChange = (cId: number | null) => {
    setCountryId(cId ?? null);
    // update form fields and clear region/city
    form.setFieldsValue({
      country: cId ?? undefined,
      region: undefined,
      city: undefined,
    });
    setRegionId(null);
  };

  // When region changes: update form and local state and clear city
  const handleRegionChange = (rId: number | null) => {
    setRegionId(rId ?? null);
    form.setFieldsValue({
      region: rId ?? undefined,
      city: undefined,
    });
  };

  const handleCityChange = (ctId: number | null) => {
    form.setFieldsValue({
      city: ctId ?? undefined,
    });
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={form}
          onFinish={onFinish}
          disabled={addState.isLoading}
          autoComplete="off"
          clearOnDestroy
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the clinic name" },
              { min: 2, message: "Name must be at least 2 characters" },
              { max: 100, message: "Name must not exceed 100 characters" },
            ]}
          >
            <Input placeholder="e.g., Jesus Hospital" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item label="Website" name="website_url">
            <Input placeholder="https://example.com" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input placeholder="+51 987654321" />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input placeholder="Address" />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please select a country" }]}
          >
            <CountrySelect
              placeholder="Select a country"
              value={form.getFieldValue("country") ?? undefined}
              onChange={(v) => handleCountryChange(v)}
              preload
            />
          </Form.Item>

          <Form.Item
            label="Region"
            name="region"
            rules={[{ required: true, message: "Please select a region" }]}
          >
            <RegionSelect
              placeholder="Select a region"
              countryId={countryId}
              value={form.getFieldValue("region") ?? undefined}
              onChange={(v) => handleRegionChange(v)}
            />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please select a city" }]}
          >
            <CitySelect
              placeholder="Select a city"
              countryId={countryId}
              regionId={regionId}
              value={form.getFieldValue("city") ?? undefined}
              onChange={(v) => handleCityChange(v)}
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => form.resetFields()}>Reset</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={addState.isLoading}
              >
                Save Clinic
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Tabs section below the form */}
      <Card>
        <Tabs defaultActiveKey="1" destroyOnHidden>
          <TabPane tab="Speciality" key="speciality" disabled={!clinicId}>
            {/* Speciality management: transfer component that assigns specialities to current clinic */}
            {clinicId ? <TransferClinicSpeciality idClinic={clinicId} /> : null}
          </TabPane>
          <TabPane tab="Test" key="test" disabled={!clinicId}>
            {/* placeholder for Tests tab */}
          </TabPane>
          <TabPane tab="Doctors" key="doctors" disabled={!clinicId}>
            {/* placeholder for Doctors tab */}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default ClinicManipulate;
