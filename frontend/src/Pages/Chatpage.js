import { Row, Col } from "antd";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {user && <SideDrawer />}
      <div style={{ display: "flex", gap: "20px", height: "100%" }}>
        <div style={{ width: "25%", padding: "10px", height: "100%" }}>
          <MyChats fetchAgain={fetchAgain} />
        </div>
        <div style={{ width: "75%", padding: "10px", height: "100%" }}>
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
      </div>
    </div>
  );
};

export default Chatpage;
