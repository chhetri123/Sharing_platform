const express = require("express");
const userRouter = express.Router();

const authMiddleware = require("../middleware/auth");
const { searchUsers } = require("../controllers/userController");

userRouter.get("/search", authMiddleware, searchUsers);

module.exports = userRouter;
