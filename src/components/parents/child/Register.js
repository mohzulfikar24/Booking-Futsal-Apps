import React, { memo, useState } from "react";
import { Form, message, Input, Button, Select } from "antd";
import { registerAuth } from "../../../utils/Axios";
import { useDispatch } from "react-redux";

function Register({ changeTab = () => {} }) {

  const [loading, setLoading] = useState(false)
  // handle jika form semua field terisi
  const onFinish = async (values) => {
    try {
      setLoading(true)
      const body = {
        role: values.role,
        phone_number: values.phoneNumber,
        passwords: values.password,
        email: values.email,
        name: values.username,
      };
      const result = await registerAuth(body);
      message.success(result.data.msg);
      changeTab("Login");
      window.scrollTo(0, 0);
      setLoading(false)
    } catch (error) {
      console.log(error);
      message.info(error.response.data.msg);
      setLoading(false)
    }
  };

  return (
    <div className="">
      <Form
        name="basic"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        style={{ maxWidth: "100%" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
            {
              pattern:
              /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Please Input Your Email Correctly",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="phoneNumber"
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: "Please input your phone number!",
            },
            {
              min: 12,
              message: "telephone number is too short !",
            },
            {
              max: 13,
              message: "the phone number is too long !",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="access"
          name="role"
          rules={[
            {
              required: true,
              message: "Please input your users access!",
            },
          ]}
        >
          <Select
            showSearch
            style={{
              width: "100%",
            }}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            allowClear={true}
            bordered={true}
            dropdownStyle={{ color: "blue" }}
            options={[
              {
                value: "owner",
                label: "owner",
              },
              {
                value: "customer",
                label: "customer",
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 21,
            span: 24,
          }}
        >
          <Button loading={loading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default memo(Register);
