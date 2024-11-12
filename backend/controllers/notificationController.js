const Notification = require("../models/Notification");

const notificationController = {
  getNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find({
        recipient: req.user.userId,
      })
        .sort("-createdAt")
        .populate("sender", "name email profilePicture")
        .populate("eventId", "title");

      res.json(notifications);
    } catch (error) {
      console.error("Error in getNotifications:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  markAsRead: async (req, res) => {
    try {
      const notification = await Notification.findOneAndUpdate(
        {
          _id: req.params.notificationId,
          recipient: req.user.userId,
        },
        { read: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.json(notification);
    } catch (error) {
      console.error("Error in markAsRead:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = notificationController;
