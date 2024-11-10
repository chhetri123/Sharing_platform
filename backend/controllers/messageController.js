const Message = require("../models/Message");
const Event = require("../models/Event");

const messageController = {
  // Get event messages (REST endpoint)
  getEventMessages: async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.userId;

      // Check if user is participant
      const event = await Event.findById(eventId);
      if (!event || !event.participants.includes(userId)) {
        return res
          .status(403)
          .json({ message: "Not authorized to view messages" });
      }

      // Get messages with populated sender info
      const messages = await Message.find({ eventId })
        .populate("sender", "name email profilePicture")
        .sort("createdAt");

      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = messageController;
