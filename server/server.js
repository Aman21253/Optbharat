const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const protect = require("./middleware/auth");
const reviewRoutes = require("./routes/reviewRoute");
const { errorHandler } = require("./middleware/errorMiddleware");
const { notFound } = require("./middleware/notFound");

const brandRoutes = require("./routes/brandRoutes");
const userRoutes = require("./routes/userRoutes");
const suggestionsRoutes = require("./routes/suggestionsRoutes");
const alternativeRoutes = require("./routes/alternativeRoutes");

// Load environment variables
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://optbharat.com/',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    mongoose.connect('mongodb://127.0.0.1:27017/makeinindia');
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/api/brands", brandRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brand-suggestions", suggestionsRoutes);
app.use("/api/alternatives", alternativeRoutes);
app.use("/api/reviews", protect, reviewRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Custom middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});