const User = require("../models/User");
const Event = require("../models/Event");
const Photo = require("../models/Photo");
const Message = require("../models/Message");

const dashboardController = {
  getDashboardData: async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      const eventCount = await Event.countDocuments();
      const events = await Event.find().sort({ createdAt: -1 }).limit(5); // Get the latest 5 events

      // Fetch message statistics by user, event, and date
      const messageStats = await Message.aggregate([
        {
          $group: {
            _id: {
              userId: "$sender",
              eventId: "$eventId",
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id.userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "_id.eventId",
            foreignField: "_id",
            as: "eventInfo",
          },
        },
        {
          $unwind: "$userInfo",
        },
        {
          $unwind: "$eventInfo",
        },
        {
          $project: {
            _id: 0,
            userName: "$userInfo.name",
            eventName: "$eventInfo.title",
            date: "$_id.date",
            count: 1,
          },
        },
      ]);

      res.json({
        userCount,
        eventCount,
        latestEvents: events,
        messageStats, // Include message statistics in the response
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getPhotoStatistics: async (req, res) => {
    try {
      const totalPhotos = await Photo.countDocuments();
      const photosByUser = await Photo.aggregate([
        {
          $group: {
            _id: "$userId",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users", // The name of the User collection
            localField: "_id",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $unwind: "$userInfo", // Unwind the userInfo array to get the name
        },
        {
          $project: {
            _id: 0, // Exclude the _id field
            userId: "$userInfo._id",
            userName: "$userInfo.name", // Include the user's name
            count: 1,
          },
        },
      ]);

      res.json({
        totalPhotos,
        photosByUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = dashboardController;
