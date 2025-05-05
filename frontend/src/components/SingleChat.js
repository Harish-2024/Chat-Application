import { Button, Input, Row, Col, Typography, Spin, Tag } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";

const { Text } = Typography;

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (event) => {
    if ((event?.key === "Enter" || event === "manual") && newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post("/api/message", {
          content: newMessage,
          chatId: selectedChat._id,
        }, config);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setNewMessage("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("online users", (users) => setOnlineUsers(users));
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const now = new Date().getTime();
      const timeDiff = now - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const isUserOnline = () => {
    const otherUser = getSenderFull(user, selectedChat.users);
    return onlineUsers.includes(otherUser._id);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Row
            justify="space-between"
            align="middle"
            style={{ paddingBottom: "15px", paddingLeft: "10px" }}
          >
            <Col>
              <Button icon={<ArrowLeftOutlined />} onClick={() => setSelectedChat(null)} />
            </Col>
            <Col>
              <Text style={{ fontSize: "24px", fontFamily: "Work sans" }}>
                {getSender(user, selectedChat.users)}{" "}
                {isUserOnline() && <Tag color="green">Online</Tag>}
              </Text>
              <p>{istyping ? "Typing..." : ""}</p>
            </Col>
          </Row>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "10px",
              background: "#F5F5F5",
              width: "100%",
              height: "70vh",
              borderRadius: "10px",
              overflowY: "auto",
            }}
          >
            {loading ? (
              <Spin style={{ margin: "auto" }} />
            ) : (
              messages.map((msg, i) => {
                const isSender = msg.sender._id === user._id;
                return (
                  <div
                    key={i}
                    style={{
                      alignSelf: isSender ? "flex-end" : "flex-start",
                      background: isSender ? "#38B2AC" : "#E8E8E8",
                      color: isSender ? "white" : "black",
                      borderRadius: "20px",
                      padding: "10px 15px",
                      margin: "5px",
                      maxWidth: "75%",
                    }}
                  >
                    {msg.content}
                  </div>
                );
              })
            )}
            
          </div>

          <Row style={{ marginTop: "10px" }} gutter={8}>
            <Col span={22}>
              <Input
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
                style={{
                  background: "#E0E0E0",
                  borderRadius: "20px",
                  padding: "10px",
                }}
              />
            </Col>
            <Col span={2}>
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={() => sendMessage("manual")}
              />
            </Col>
          </Row>
        </>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <Text style={{ fontSize: "24px", fontFamily: "Work sans" }}>
            Click on a user to start chatting
          </Text>
        </div>
      )}
    </>
  );
};

export default SingleChat;
