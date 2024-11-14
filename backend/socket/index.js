const socketIO = require("socket.io");
const messageHandlers = require("./handlers/messageHandlers");
const notificationHandlers = require("./handlers/notificationHandlers");
const jwt = require("jsonwebtoken");

function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token =
        socket?.handshake["headers"]?.token || socket?.handshake?.auth?.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded;

      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    // Join user to their personal room
    socket.join(`user:${socket.user.userId}`);

    // Join user to their specific rooms
    socket.on("join-event", (eventId) => {
      socket.join(`event:${eventId}`);
    });

    // Handle messages
    messageHandlers(io, socket);
    // Add notification handlers
    notificationHandlers(io, socket);
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.userId}`);
    });
  });

  return io;
}

module.exports = initializeSocket;
