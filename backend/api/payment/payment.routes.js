import express from "express";
import { createRazorpayOrder, verifyPayment } from "./payment.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Apply protection to all payment routes
router.use(protectRoute);

// Create a Razorpay order ID before checkout
router.post("/create-order", createRazorpayOrder);

// Verify the payment signature after checkout
router.post("/verify", verifyPayment);

export default router;
