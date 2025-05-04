import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Tabs, Typography } from "antd";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const { TabPane } = Tabs;
const { Title } = Typography;

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", padding: "10px" }}>
      <Card
        style={{ width: "100%", maxWidth: 600, textAlign: "center" }}
        title={<Title level={2}>Chat App</Title>}
        bordered={false}
      >
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Login" key="1">
            <Login />
          </TabPane>
          <TabPane tab="Sign Up" key="2">
            <Signup />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default Homepage;
