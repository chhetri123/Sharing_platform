const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/isLoggedIn", verifyToken, authController.isLoggedIn);

module.exports = router;
