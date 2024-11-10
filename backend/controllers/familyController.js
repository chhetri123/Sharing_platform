const User = require("../models/User");
const Event = require("../models/Event");

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

  removeFamilyMember: async (req, res) => {
    try {
      const { familyMemberId } = req.params;

      // Prevent removing self
      if (familyMemberId === req.user.userId) {
        return res.status(400).json({
          message: "You cannot remove yourself from family members",
        });
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the member is actually in the family
      if (!user.familyMembers.includes(familyMemberId)) {
        return res.status(400).json({
          message: "This person is not in your family members",
        });
      }

      // Remove family member from user's list
      user.familyMembers = user.familyMembers.filter(
        (id) => id.toString() !== familyMemberId
      );
      await user.save();

      // Remove reciprocal relationship
      const familyMember = await User.findById(familyMemberId);
      if (familyMember) {
        familyMember.familyMembers = familyMember.familyMembers.filter(
          (id) => id.toString() !== user._id.toString()
        );
        await familyMember.save();
      }
      const userEvents = await Event.find({ creator: req.user.userId });
      if (userEvents.length > 0) {
        await Event.updateMany(
          { creator: req.user.userId },
          { $pull: { participants: familyMemberId } }
        );
      }

      const familyMemberEvents = await Event.find({ creator: familyMemberId });
      if (familyMemberEvents.length > 0) {
        await Event.updateMany(
          { creator: familyMemberId },
          { $pull: { participants: req.user.userId } }
        );
      }
      res.json({
        message: "Family member removed successfully",
      });
    } catch (error) {
      console.error("Error in removeFamilyMember:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = familyController;
