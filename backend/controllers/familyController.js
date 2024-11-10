const User = require("../models/User");

// Export as an object with named functions
const familyController = {
  addFamilyMember: async (req, res) => {
    try {
      const { familyMemberId } = req.body;
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.familyMembers.includes(familyMemberId)) {
        return res.status(400).json({ message: "Family member already added" });
      }

      user.familyMembers.push(familyMemberId);
      await user.save();

      // Add reciprocal relationship
      const familyMember = await User.findById(familyMemberId);
      if (familyMember && !familyMember.familyMembers.includes(user._id)) {
        familyMember.familyMembers.push(user._id);
        await familyMember.save();
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getFamilyMembers: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).populate(
        "familyMembers",
        "name email profilePicture"
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = familyController;
