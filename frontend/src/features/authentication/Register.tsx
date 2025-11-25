import {
  GithubOutlined,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import type { RuleObject } from "antd/es/form";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Link } from "react-router";
import { useRegister } from "../../hooks/useRegister";
import { ROUTES } from "../../routers/routes";
import type { RegisterForm } from "../../types";
import { toRegisterDTO } from "../../utils/Dtos";
import {
  COUNTRY_CODES,
  DOC_TYPE_LENGTHS,
  DOC_TYPES,
  GENDERS,
  MIN_AGE,
} from "../../utils/HardcoreData";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const passwordStrengthRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[\]{};:'"\\|,.<>/?]).{9,}$/;

const Register = () => {
  const [form] = Form.useForm<RegisterForm>();
  const { handleRegister, isLoading } = useRegister(form);

  const onFinish = (values: RegisterForm) => {
    const payload = toRegisterDTO(values);
    handleRegister(payload);
  };

  const validatePasswords = (_: RuleObject, value: string) => {
    const pwd1 = form.getFieldValue("password1");
    if (!value || pwd1 === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("The two password fields didn't match."));
  };

  // Validator: when gender == CUSTOM, custom_gender must be present
  const validateCustomGender = (_: RuleObject, value: string) => {
    const gender = form.getFieldValue("gender");
    if (gender !== "CUSTOM") return Promise.resolve();
    if (value && String(value).trim() !== "") return Promise.resolve();
    return Promise.reject(
      new Error(
        "The custom gender field cannot be empty when gender is CUSTOM."
      )
    );
  };

  // Validator: document_value must match required length when type has one
  const validateDocumentValue = (_: RuleObject, value: string) => {
    const docType = form.getFieldValue("document_type");
    const required = DOC_TYPE_LENGTHS[docType];
    if (!required) return Promise.resolve();
    if (value && String(value).length === required) return Promise.resolve();
    return Promise.reject(
      new Error(
        `Document value for type '${docType}' must be exactly ${required} digits/characters.`
      )
    );
  };

  // Validator: birth_date minimum age
  const validateBirthDate = (_: RuleObject, value?: Dayjs) => {
    if (!value)
      return Promise.reject(new Error("Please select your birth date"));
    const age = dayjs().diff(value, "year");
    if (age >= MIN_AGE) return Promise.resolve();
    return Promise.reject(
      new Error(`You must be at least ${MIN_AGE} years old.`)
    );
  };

  // disable dates that would make the user younger than MIN_AGE or future dates
  const disabledBirthDate = (current?: Dayjs) => {
    if (!current) return false;
    const age = dayjs().diff(current, "year");
    return age < MIN_AGE;
  };

  // Password strength validator for password1
  const validatePasswordStrength = (_: RuleObject, value: string) => {
    if (!value) return Promise.reject(new Error("Please input your password!"));
    if (!passwordStrengthRegex.test(value)) {
      return Promise.reject(
        new Error(
          "Password must be at least 9 characters long, contain at least one uppercase letter and one special character."
        )
      );
    }
    return Promise.resolve();
  };

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-3xl shadow-md">
        <div className="text-center mb-6">
          <Title level={2} className="mb-1">
            Create Account
          </Title>
          <Paragraph className="text-gray-500">
            Join us to start using the dashboard
          </Paragraph>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          disabled={isLoading}
          layout="vertical"
          size="large"
          initialValues={{
            gender: "NONE",
            document_type: "01",
            country_code: "51",
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="First name"
                name="first_name"
                rules={[
                  { required: true, message: "Please input your first name!" },
                  {
                    max: 150,
                    message: "First name must not exceed 150 characters",
                  },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message: "First name can only contain letters!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="First name" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Last name"
                name="last_name"
                rules={[
                  { required: true, message: "Please input your last name!" },
                  {
                    max: 150,
                    message: "Last name must not exceed 150 characters",
                  },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message: "Last name can only contain letters!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Last name" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
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
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Gender" name="gender">
                <Select size="middle">
                  {GENDERS.map((g) => (
                    <Option key={g.value} value={g.value}>
                      {g.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              {/* custom_gender disabled unless gender === 'CUSTOM' */}
              <Form.Item
                label="Custom gender"
                name="custom_gender"
                dependencies={["gender"]}
                rules={[{ validator: validateCustomGender }]}
              >
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const gender = form.getFieldValue("gender");
                    return (
                      <Input
                        placeholder="Specify gender (required if 'Custom' selected)"
                        disabled={gender !== "CUSTOM"}
                      />
                    );
                  }}
                </Form.Item>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Phone" style={{ marginBottom: 0 }} required>
                <Input.Group compact>
                  <Form.Item name="country_code" noStyle>
                    <Select style={{ width: 120 }}>
                      {COUNTRY_CODES.map((c) => (
                        <Option key={c.value} value={c.value}>
                          {c.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Please input your phone number!",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "calc(100% - 120px)" }}
                      placeholder="987654321"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Birth date"
                name="birth_date"
                rules={[{ validator: validateBirthDate }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  disabledDate={disabledBirthDate}
                  style={{ width: "100%" }}
                  placeholder="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Document type"
                name="document_type"
                rules={[
                  { required: true, message: "Please select document type" },
                ]}
              >
                <Select size="middle">
                  {DOC_TYPES.map((d) => (
                    <Option value={d.value} key={d.value}>
                      {d.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Document value"
                name="document_value"
                dependencies={["document_type"]}
                rules={[
                  {
                    required: true,
                    message: "Please input the document value",
                  },
                  {
                    max: 20,
                    message: "Document value must not exceed 20 characters",
                  },
                  { validator: validateDocumentValue },
                ]}
              >
                <Input placeholder="Document value (numbers/characters)" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Password"
                name="password1"
                rules={[{ validator: validatePasswordStrength }]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Confirm password"
                name="password2"
                dependencies={["password1"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  { validator: validatePasswords },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm password"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            style={{ marginTop: 8 }}
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("You must accept the terms and conditions")
                      ),
              },
            ]}
          >
            <Checkbox>
              I agree to the <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Register
            </Button>
          </Form.Item>

          <div className="text-center">
            <Paragraph className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="text-blue-500 hover:text-blue-700"
              >
                Log in
              </Link>
            </Paragraph>
          </div>

          <Divider plain>or register with</Divider>

          <div className="flex justify-center space-x-4">
            <Button icon={<GoogleOutlined />} size="large">
              Google
            </Button>
            <Button icon={<GithubOutlined />} size="large">
              GitHub
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
