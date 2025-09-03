import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // --- This section remains updated to create a snapshot of the order ---
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        // --- Snapshot Details ---
        productName: { type: String, required: true },
        variantName: { type: String, required: true },
        size: { type: String, required: true },
        colorName: { type: String, required: true },
        price: { type: Number, required: true }, // Price per unit at time of purchase
        image: { type: String, required: true }, // A representative image URL
        nameToPrint: { type: String },
      },
    ],
    // --------------------------------------------------------------------
    totalAmount: {
      type: Number,
      required: true,
    },
    razorpayId: {
      type: String,
      default: "Razorpay",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
