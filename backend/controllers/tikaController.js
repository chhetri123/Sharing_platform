const Tika = require("../models/Tika");

const tikaController = {
  sendTika: async (req, res) => {
    try {
      const { receiverId, message } = req.body;
      const tika = new Tika({
        senderId: req.user.userId,
        receiverId,
        message,
      });

      await tika.save();
      res.status(201).json(tika);
    } catch (error) {
      console.log("Error sending tika:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getTikas: async (req, res) => {
    try {
      const tikas = await Tika.find({ receiverId: req.user.userId })
        .populate("senderId", "name")
        .sort("-createdAt");
      res.json(tikas);
    } catch (error) {
      console.log("Error getting tikas:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = tikaController;
