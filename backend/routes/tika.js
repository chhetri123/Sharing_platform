const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { sendTika, getTikas } = require("../controllers/tikaController");

router.post("/", auth, sendTika);
router.get("/", auth, getTikas);

module.exports = router;
