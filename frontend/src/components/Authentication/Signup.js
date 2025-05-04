import { Form, Input, Button, Upload, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    setLoading(true);
    const { name, email, password, confirmpassword } = values;

    if (!name || !email || !password || !confirmpassword) {
      message.warning("Please fill all the fields");
      return;
    }

    if (password !== confirmpassword) {
      message.warning("Passwords do not match");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password
        },
        config
      );

      message.success("Registration Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      message.error(
        error.response?.data?.message || "An error occurred during signup"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={submitHandler}
      style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter your name" }]}
      >
        <Input placeholder="Enter Your Name" />
      </Form.Item>

      <Form.Item
        label="Email Address"
        name="email"
        rules={[{ required: true, message: "Please enter your email" }]}
      >
        <Input type="email" placeholder="Enter Your Email Address" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password placeholder="Enter Password" />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmpassword"
        rules={[{ required: true, message: "Please confirm your password" }]}
      >
        <Input.Password placeholder="Confirm Password" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          style={{ marginTop: 15 }}
        >
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Signup;
