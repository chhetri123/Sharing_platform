const User = require("../models/User");

const searchUsers = async (req, res) => {
  try {
    const { email } = req.query;

    // Search for users whose email matches the search query
    // Exclude the current user from results
    const users = await User.find({
      email: { $regex: email, $options: "i" },
      _id: { $ne: req.user._id },
    }).select("name email profilePicture");

    res.json({ users });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ message: "Error searching users" });
  }
};

module.exports = {
  searchUsers,
};
