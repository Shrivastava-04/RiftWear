import express from "express";
import {
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "./order.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/admin.middleware.js";

const router = express.Router();

// Apply user protection to all order routes
router.use(protectRoute);

// Get all orders for the currently logged-in user
router.get("/my-orders", getMyOrders);

// Get a single order by its ID
router.get("/:id", getOrderById);

// Update an order's status (e.g., to "Shipped")

export default router;
