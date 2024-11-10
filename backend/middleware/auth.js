const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get auth header
  const authHeader = req.header("Authorization");

  // Check if auth header exists
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // Check if it follows Bearer scheme
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid authorization scheme" });
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
