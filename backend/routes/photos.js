const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", auth, upload.single("photo"), photoController.uploadPhoto);
router.get("/shared", auth, photoController.getSharedPhotos);
router.get("/user", auth, photoController.getUserPhotos);
router.post("/:photoId/like", auth, photoController.toggleLike);
router.delete("/:photoId", auth, photoController.deletePhoto);

module.exports = router;
