import express from "express";
import {
  createDrop,
  getAllDrops,
  updateDrop,
  deleteDrop,
  checkDropStatus,
  getActiveDrop,
} from "./drop.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/admin.middleware.js";

const router = express.Router();

// --- PUBLIC ROUTE (accessible to everyone) ---
// This is the most important route for the frontend to check if payments are live.
router.post("/status", checkDropStatus);
router.get("/active", getActiveDrop);

// --- ADMIN PROTECTED ROUTES (accessible only to logged-in admins) ---
router.get("/all", protectRoute, adminOnly, getAllDrops);
router.post("/", protectRoute, adminOnly, createDrop);
router.put("/:id", protectRoute, adminOnly, updateDrop);
router.delete("/:id", protectRoute, adminOnly, deleteDrop);

export default router;
