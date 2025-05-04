import { Card } from "antd";
import "./styles.css";
import SingleChat from "./SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        backgroundColor: "white",
        width:"100%",
        height:"90%",
        borderRadius: "8px",
        border: "1px solid #d9d9d9",
      }}
      bodyStyle={{ padding: 0 }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Card>
  );
};

export default Chatbox;
