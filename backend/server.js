const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

// Maintain a map of online users (key = userId, value = socket.id)
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // User connects and sets up socket
  socket.on("setup", (userData) => {
      socket.join(userData._id);
      onlineUsers.set(userData._id, socket.id); // Add to online map
      io.emit("online users", Array.from(onlineUsers.keys())); // Notify all
      socket.emit("connected");
      console.log(`USER CONNECTED: ${userData.name}`);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room:", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.on("disconnect", () => {
    // Find user by socket ID and remove from map
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("online users", Array.from(onlineUsers.keys()));
    console.log("USER DISCONNECTED");
  });
});
