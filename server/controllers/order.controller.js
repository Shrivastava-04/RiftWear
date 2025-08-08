// // In your backend, e.g., src/controllers/orderController.js
// import Order from "../models/orders.model.js";
// import User from "../models/user.model.js";

// export const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       razorpayPaymentId,
//       razorpayOrderId,
//       totalAmount,
//     } = req.body;

//     const newOrder = new Order({
//       orderNumber: razorpayOrderId, // Or generate a new one
//       detailsOfCustomer: userId,
//       detailsOfProduct: cartItems.map((item) => ({
//         productId: item.productId._id,
//         size: item.size,
//         color: item.color,
//         variety: item.variety,
//         quantity: item.quantity,
//       })),
//       amount: totalAmount,
//       razorpayId: razorpayPaymentId,
//     });

//     const savedOrder = await newOrder.save();

//     // Clear the user's cart
//     await User.findByIdAndUpdate(userId, { cartItem: [] });

//     // Add the order ID to the user's order history
//     await User.findByIdAndUpdate(userId, { $push: { order: savedOrder._id } });

//     res
//       .status(201)
//       .json({ message: "Order created successfully", order: savedOrder });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const getOrderById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid order ID format" });
//     }

//     const order = await Order.findById(id)
//       .populate("detailsOfCustomer", "name email phoneNumber") // Populate customer details
//       .populate("detailsOfProduct.productId", "name images price"); // Populate product details

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json({ order });
//   } catch (error) {
//     console.error("Error fetching order by ID:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// src/controllers/order.controller.js

import mongoose from "mongoose";
import Order from "../models/orders.model.js"; // Correct import for the Order model
import User from "../models/user.model.js"; // <-- ADD THIS IMPORT
import Product from "../models/product.model.js"; // <-- ADD THIS IMPORT

// This function handles the final order creation after a successful payment
export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      razorpayPaymentId,
      razorpayOrderId,
      totalAmount,
    } = req.body;

    const newOrder = new Order({
      orderNumber: razorpayOrderId,
      detailsOfCustomer: userId,
      detailsOfProduct: cartItems.map((item) => ({
        productId: item.productId._id,
        size: item.size,
        color: item.color,
        variety: item.variety,
        quantity: item.quantity,
      })),
      amount: totalAmount,
      razorpayId: razorpayPaymentId,
    });

    const savedOrder = await newOrder.save();

    // Clear the user's cart
    await User.findByIdAndUpdate(userId, { cartItem: [] });

    // Add the order ID to the user's order history
    await User.findByIdAndUpdate(userId, { $push: { order: savedOrder._id } });

    res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// This function fetches an order by its ID to display on the confirmation page
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const order = await Order.findById(id)
      .populate("detailsOfCustomer", "name email phoneNumber")
      .populate("detailsOfProduct.productId", "name images price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
