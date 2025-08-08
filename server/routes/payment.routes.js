// In your backend, e.g., src/routes/paymentRoutes.js
import express from "express";
import { createRazorpayOrder } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/razorpay/create-order", createRazorpayOrder);

export default router;
