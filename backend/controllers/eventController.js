const Event = require("../models/Event");
const User = require("../models/User");

const eventController = {
  createEvent: async (req, res) => {
    try {
      const { title, date, description } = req.body;

      // Create the event
      const event = new Event({
        title,
        date,
        description,
        creator: req.user.userId,
        participants: [req.user.userId], // Add creator as first participant
      });

      await event.save();
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getEvents: async (req, res) => {
    try {
      // Get the current user with their family members
      const currentUser = await User.findById(req.user.userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Find events where:
      // 1. User is a participant AND
      // 2. (User is the creator OR Creator is in user's family members)
      const events = await Event.find({
        participants: req.user.userId, // User must be a participant
        $or: [
          { creator: req.user.userId }, // User is creator
          { creator: { $in: currentUser.familyMembers } }, // Creator is in user's family
        ],
      })
        .sort("date")
        .populate("creator", "name email profilePicture")
        .populate("participants", "name email profilePicture");

      res.json(events);
    } catch (error) {
      console.log("Error getting events:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  joinEvent: async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.userId;

      console.log("Attempting to join event:", { eventId, userId });

      // Find the event
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if user is already a participant
      if (event.participants.includes(userId)) {
        return res.status(400).json({ message: "Already joined this event" });
      }

      // Get both the creator and the user trying to join
      const [creator, joiningUser] = await Promise.all([
        User.findById(event.creator),
        User.findById(userId),
      ]);

      console.log("Creator family members:", creator.familyMembers);
      console.log("Joining user ID:", userId);

      // Check if the user is either:
      // 1. The creator
      // 2. In creator's family members
      // 3. Creator is in user's family members
      const isCreator = event.creator.toString() === userId;
      const isInCreatorFamily = creator.familyMembers.includes(userId);
      const isCreatorInUserFamily = joiningUser.familyMembers.includes(
        event.creator.toString()
      );

      console.log("Access checks:", {
        isCreator,
        isInCreatorFamily,
        isCreatorInUserFamily,
      });

      if (!isCreator && !isInCreatorFamily && !isCreatorInUserFamily) {
        return res.status(403).json({
          message: "Only family members can join this event",
        });
      }

      // Add user to participants
      event.participants.push(userId);
      await event.save();

      // Return populated event
      const populatedEvent = await Event.findById(eventId)
        .populate("creator", "name email")
        .populate("participants", "name email");

      res.status(200).json(populatedEvent);
    } catch (error) {
      console.error("Join Event Error:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
        stack: error.stack,
      });
    }
  },

  getEventDetails: async (req, res) => {
    try {
      const { eventId } = req.params;
      console.log(eventId);
      const userId = req.user.userId;

      // Find event and populate creator and participants
      const event = await Event.findById(eventId)
        .populate("creator", "name email profilePicture")
        .populate("participants", "name email profilePicture");

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if user is creator or participant
      const isParticipant = event.participants.some(
        (p) => p._id.toString() === userId
      );
      const isCreator = event.creator._id.toString() === userId;

      if (!isParticipant && !isCreator) {
        return res
          .status(403)
          .json({ message: "Not authorized to view this event" });
      }

      // Check if user has joined the event
      const isJoined = event.participants.some(
        (p) => p._id.toString() === userId
      );

      res.json({
        event,
        isJoined,
        isCreator,
      });
    } catch (error) {
      console.error("Get event details error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getUnjoinedFamilyEvents: async (req, res) => {
    try {
      // Get the current user with their family members
      console.log(req.user.userId);
      const currentUser = await User.findById(req.user.userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Find events where:
      // 1. Creator is in user's family members AND
      // 2. Current user is NOT in participants
      const events = await Event.find({
        creator: { $in: currentUser.familyMembers }, // Created by family member
        participants: { $ne: req.user.userId }, // User hasn't joined
        date: { $gte: new Date() }, // Optional: Only future events
      })
        .sort("date")
        .populate("creator", "name email profilePicture")
        .populate("participants", "name email profilePicture");

      res.json(events);
    } catch (error) {
      console.log("Error getting unjoined family events:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = eventController;
