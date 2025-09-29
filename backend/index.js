import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// We will create this file in the next step. It will manage all the API routes.
import apiRoutes from "./api/index.js";

// --- Basic Setup ---
dotenv.config();
const app = express();

const PORT = process.env.PORT || 10000; // Added a fallback port
const URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

// --- Middleware ---
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(cookieParser()); // To parse cookies

// --- Database Connection ---
try {
  mongoose.connect(URI);
  console.log("✅ Connected to MongoDB");
} catch (error) {
  console.error("❌ Error connecting to MongoDB:", error);
}

app.get("/", (req, res) => {
  res.send("API is running");
});

// --- API Routes ---
// All your API routes will now be neatly handled under a single entry point.
// This makes your main file much cleaner.
app.use("/api/v1", apiRoutes);

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
