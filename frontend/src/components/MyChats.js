import { useState, useEffect } from "react";
import axios from "axios";
import { Typography, List } from "antd";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";

const { Text, Title } = Typography;

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const apiUrl = process.env.REACT_APP_API_URL;
      const { data } = await axios.get(`${apiUrl}/api/chat`, config);
      setChats(data);
    } catch (error) {
      console.error("Error Occurred:", error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "white",
        width: "100%",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        height: "100%",
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        My Chats
      </Title>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          backgroundColor: "#F8F8F8",
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          overflowY: "hidden",
        }}
      >
        {chats ? (
          <List
            style={{ overflowY: "scroll", padding: 0 }}
            dataSource={chats}
            renderItem={(chat) => (
              <List.Item
                style={{
                  backgroundColor:
                    selectedChat === chat ? "#38B2AC" : "#E8E8E8",
                  color: selectedChat === chat ? "white" : "black",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
                onClick={() => setSelectedChat(chat)}
              >
                <div style={{ width: "100%" }}>
                  <Text strong>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <div>
                      <Text style={{ fontSize: "12px" }}>
                        <b>{chat.latestMessage.sender.name}:</b>{" "}
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
