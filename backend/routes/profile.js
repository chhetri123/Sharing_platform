const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const profileController = require("../controllers/profileController");

router.get("/", auth, profileController.getProfile);
router.put(
  "/",
  auth,
  upload.single("profilePicture"),
  profileController.updateProfile
);

module.exports = router;
