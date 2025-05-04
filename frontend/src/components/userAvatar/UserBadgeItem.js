import { Tag } from "antd";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Tag
      closable
      onClose={(e) => {
        e.preventDefault(); // Prevent default tag close behavior
        handleFunction();
      }}
      color="purple"
      style={{ marginBottom: 8, cursor: "pointer", userSelect: "none" }}
    >
      {user.name}
      {admin === user._id && " (Admin)"}
    </Tag>
  );
};

export default UserBadgeItem;
