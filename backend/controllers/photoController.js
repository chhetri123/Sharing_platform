const Photo = require("../models/Photo");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const photoController = {
  uploadPhoto: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Create a stream to upload the file
      const stream = cloudinary.uploader.upload_stream(
        { folder: "uploads" },
        async (error, result) => {
          if (error) {
            return res.status(500).json({
              message: "Upload to Cloudinary failed",
              error: error.message,
            });
          }

          const photo = new Photo({
            userId: req.user.userId,
            imageUrl: result.secure_url, // Use the secure URL from Cloudinary
            description: req.body.description || "",
          });

          await photo.save();
          res.status(201).json(photo);
        }
      );

      stream.end(req.file.buffer); // Send the file buffer to Cloudinary
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get photos shared by family members and user
  getSharedPhotos: async (req, res) => {
    try {
      const currentUser = await User.findById(req.user.userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const photos = await Photo.find({
        userId: { $in: [...currentUser.familyMembers, req.user.userId] },
      })
        .populate("userId", "name email profilePicture")
        .populate("likes", "name profilePicture")
        .sort("-createdAt");

      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get only user's photos
  getUserPhotos: async (req, res) => {
    try {
      const photos = await Photo.find({ userId: req.user.userId })
        .populate("userId", "name email profilePicture")
        .sort("-createdAt");
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  toggleLike: async (req, res) => {
    try {
      const photo = await Photo.findById(req.params.photoId);
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }

      const likeIndex = photo.likes.indexOf(req.user.userId);
      if (likeIndex === -1) {
        photo.likes.push(req.user.userId);
      } else {
        photo.likes.splice(likeIndex, 1);
      }

      await photo.save();
      res.json({ likes: photo.likes });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  deletePhoto: async (req, res) => {
    try {
      const photo = await Photo.findOne({
        _id: req.params.photoId,
        userId: req.user.userId,
      });

      if (!photo) {
        return res.status(404).json({
          message: "Photo not found or you don't have permission to delete it",
        });
      }

      // Delete the file from Cloudinary
      const publicId = photo.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);

      await photo.deleteOne();
      res.json({ message: "Photo deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = photoController;
