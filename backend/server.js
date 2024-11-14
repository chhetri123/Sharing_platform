const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");
const initializeSocket = require("./socket");

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

// Middleware
app.use(cors());
app.use(express.json());

// Add this after your middleware setup
app.use("/uploads", express.static("uploads"));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello World");
});
// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tika", require("./routes/tika"));
app.use("/api/events", require("./routes/events"));
app.use("/api/family", require("./routes/family"));
app.use("/api/photos", require("./routes/photos"));
app.use("/api/users", require("./routes/user"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Make io accessible to routes
app.set("io", io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
