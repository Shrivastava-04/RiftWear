import Razorpay from "razorpay";
import crypto from "crypto";
import { createOrder as createOrderInDB } from "../orders/order.controller.js"; // Renamed for clarity

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * @desc    Create a Razorpay order ID for the frontend
 * @route   POST /api/v1/payment/create-order
 * @access  Private
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "A valid amount is required." });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order: razorpayOrder });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc    Verify the payment signature and create the order in the database
 * @route   POST /api/v1/payment/verify
 * @access  Private
 */
export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderPayload, // This object contains all the data needed to create our order
  } = req.body;

  try {
    let isSignatureValid = false;

    // --- ONLY RUN SIGNATURE CHECK IN PRODUCTION ---
    if (process.env.NODE_ENV === "production") {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      isSignatureValid = expectedSignature === razorpay_signature;
    } else {
      // --- IN DEVELOPMENT, WE BYPASS THE CHECK FOR POSTMAN TESTING ---
      console.log("⚠️ Signature verification skipped in development mode.");
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature." });
    }

    // If signature is valid (or skipped in dev), proceed to create the order
    await createOrderInDB(req, res);
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error during payment verification." });
  }
};
