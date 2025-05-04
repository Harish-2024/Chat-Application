const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(authMiddleware, allMessages);
router.route("/").post(authMiddleware, sendMessage);

module.exports = router;
