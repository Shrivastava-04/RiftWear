import express from "express";
import {
  getAllUsers,
  getUserById,
  getAllOrders,
  getDashboardStats,
  adminRemoveCartItem,
  deleteUser,
} from "./admin.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/admin.middleware.js";

const router = express.Router();

// Apply protection to all admin routes
router.use(protectRoute, adminOnly);

// --- User Management Routes ---
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser); // <-- 4. ADD ROUTE for deleting a user

// --- Order Management Routes ---
router.get("/orders", getAllOrders);

// --- Dashboard Statistics Route ---
router.get("/stats", getDashboardStats);

// --- 2. ADD THE NEW ROUTE FOR CART MANAGEMENT ---
router.delete("/users/:userId/cart/:cartItemId", adminRemoveCartItem);

export default router;
