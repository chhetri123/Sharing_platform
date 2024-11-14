const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

      user.name = name || user.name;

      if (req.file) {
        // Delete the old profile picture from Cloudinary if it exists
        if (user.profilePicture) {
          const oldPublicId = user.profilePicture
            .split("/")
            .pop()
            .split(".")[0];
          await cloudinary.uploader.destroy(oldPublicId);
        }

        // Upload new profile picture to Cloudinary
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pictures" },
          async (error, result) => {
            if (error) {
              return res.status(500).json({
                message: "Upload to Cloudinary failed",
                error: error.message,
              });
            }

            user.profilePicture = result.secure_url; // Update the profile picture URL
            await user.save();
            const updatedUser = await User.findById(user._id).select(
              "-password"
            );
            res.status(200).json(updatedUser);
          }
        );
        stream.end(req.file.buffer); // Send the file buffer to Cloudinary
      } else {
        await user.save();
        const updatedUser = await User.findById(user._id).select("-password");
        res.status(200).json(updatedUser);
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = profileController;
