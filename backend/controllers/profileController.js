const User = require("../models/User");

const profileController = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId)
        .select("-password")
        .select("-familyMembers");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { name } = req.body;

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if email is being changed and if it's already taken

      user.name = name || user.name;

      if (req.file) {
        user.profilePicture = `/uploads/${req.file.filename}`;
      }

      await user.save();

      const updatedUser = await User.findById(user._id).select("-password");
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = profileController;
