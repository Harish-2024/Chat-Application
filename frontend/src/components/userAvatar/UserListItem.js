import { Avatar, List } from "antd";

const UserListItem = ({user, handleFunction }) => {

  return (
    <List.Item
      onClick={handleFunction}
      style={{
        cursor: "pointer",
        backgroundColor: "#E8E8E8",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#38B2AC";
        e.currentTarget.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#E8E8E8";
        e.currentTarget.style.color = "black";
      }}
    >
      <List.Item.Meta
        avatar={<Avatar src={user.pic} />}
        title={<span>{user.name}</span>}
        description={
          <span style={{ fontSize: "12px" }}>
            <b>Email: </b>
            {user.email}
          </span>
        }
      />
    </List.Item>
  );
};

export default UserListItem;
