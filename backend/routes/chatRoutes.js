const express = require("express");
const {
  accessChat,
  fetchChats
} = require("../controllers/chatControllers");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(authMiddleware, accessChat);
router.route("/").get(authMiddleware, fetchChats);

module.exports = router;
