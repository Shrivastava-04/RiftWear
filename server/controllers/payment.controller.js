// In your backend, e.g., src/controllers/paymentController.js
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid"; // For generating unique order numbers
import Product from "../models/product.model.js"; // Import your Product model
import Order from "../models/orders.model.js"; // Import your Order model
import User from "../models/user.model.js"; // Import your User model
import dotenv from "dotenv";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.Razorpay_key_API,
  key_secret: process.env.Razorpay_key_Secret_API,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, cartItems, userId } = req.body;

    if (!amount || !cartItems || !userId) {
      return res.status(400).json({
        message: "Missing required fields: amount, cartItems, or userId",
      });
    }

    const options = {
      amount: amount * 100, // Razorpay takes amount in smallest currency unit (paise)
      currency: "INR",
      receipt: uuidv4(),
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // You can optionally save a pending order in your database here
    // or wait for a successful payment webhook to save the final order.
    // For simplicity, we will save the order on the frontend's success callback.

    res.status(200).json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
