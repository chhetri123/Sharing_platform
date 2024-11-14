const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const auth = require("../middleware/auth");

router.get("/", auth, dashboardController.getDashboardData);
router.get("/statistics", auth, dashboardController.getPhotoStatistics);

module.exports = router;
