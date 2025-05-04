import { Skeleton } from "antd";

const ChatLoading = () => {
  return (
    <div>
      {Array.from({ length: 12 }).map((_, index) => (
        <Skeleton key={index} active paragraph={{ rows: 1 }} />
      ))}
    </div>
  );
};

export default ChatLoading;
