import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setUser } = ChatState();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (values) => {
    const { email, password } = values;

    setLoading(true);

    if (!email || !password) {
      message.warning("Please fill all the fields");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const apiUrl = process.env.REACT_APP_API_URL;

      const { data } = await axios.post(
        `${apiUrl}/api/user/login`,
        { email, password },
        config
      );

      message.success("Login Successful");
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      message.error(
        error.response?.data?.message || "An error occurred during login"
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
        label="Email Address"
        name="email"
        rules={[{ required: true, message: "Please enter your email" }]}
      >
        <Input placeholder="Enter Your Email Address" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password
          placeholder="Enter password"
          visibilityToggle={{
            visible: showPassword,
            onVisibleChange: setShowPassword,
          }}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          style={{ marginTop: 15 }}
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;