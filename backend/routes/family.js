const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const familyController = require("../controllers/familyController");

// Make sure we're using the correct property names from the controller
router.post("/", auth, familyController.addFamilyMember);
router.get("/", auth, familyController.getFamilyMembers);

module.exports = router;
