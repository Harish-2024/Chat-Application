import React, { useState } from "react";
import {
  Layout,
  Input,
  Button,
  Drawer,
  Menu,
  Dropdown,
  Tooltip,
  Avatar,
  Spin,
  message,
  Typography,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../userAvatar/UserListItem";

const { Header } = Layout;
const { Text } = Typography;

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const {
    setSelectedChat,
    user,
    chats,
    setChats,
  } = ChatState();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      message.warning("Please enter something in search");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const apiUrl = process.env.REACT_APP_API_URL;
      const { data } = await axios.get(`${apiUrl}/api/user?search=${search}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to load the search results");
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const apiUrl = process.env.REACT_APP_API_URL;
      const { data } = await axios.post(`${apiUrl}/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setDrawerVisible(false);
    } catch (error) {
      message.error("Error fetching the chat");
      setLoadingChat(false);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={logoutHandler}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "0 20px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Tooltip title="Search Users to chat">
          <Button type="text" icon={<SearchOutlined />} onClick={() => setDrawerVisible(true)}>
            <Text style={{ marginLeft: 8 }}>Search User</Text>
          </Button>
        </Tooltip>
        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>Chat-App</Text>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="text">
              <Avatar size="small" src={user.pic} style={{ marginRight: 8 }} />
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </Header>

      <Drawer
        title="Search Users"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <div style={{ display: "flex", marginBottom: 16 }}>
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={handleSearch}
            style={{ marginRight: 8 }}
          />
          <Button onClick={handleSearch}>Go</Button>
        </div>
        {loading ? (
          <Spin />
        ) : (
          searchResult.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => accessChat(user._id)}
            />
          ))
        )}
        {loadingChat && <Spin style={{ marginTop: 16 }} />}
      </Drawer>
    </>
  );
};

export default SideDrawer;
