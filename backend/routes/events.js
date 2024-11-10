const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const eventController = require("../controllers/eventController");
const messageController = require("../controllers/messageController");

router.post("/", auth, eventController.createEvent);
router.get("/", auth, eventController.getEvents);
router.get("/unjoined", auth, eventController.getUnjoinedFamilyEvents); // Moved up

// Parameterized routes last
router.get("/:eventId", auth, eventController.getEventDetails);
router.post("/:eventId/join", auth, eventController.joinEvent);
router.get("/:eventId/messages", auth, messageController.getEventMessages);

module.exports = router;
