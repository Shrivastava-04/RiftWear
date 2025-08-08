// In your backend, e.g., src/routes/orderRoutes.js
import express from "express";
import { createOrder, getOrderById } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/:id", getOrderById); // New route to get order by ID

export default router;
