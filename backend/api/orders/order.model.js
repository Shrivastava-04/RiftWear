import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // --- Core Order Information ---
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- Snapshot of Shipping Details (CRITICAL) ---
    // This stores a copy of the address used for this specific order.
    // This prevents history from breaking if the user updates/deletes their address later.
    shippingInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      street: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    // --- Snapshot of Items Ordered ---
    items: [
      {
        // Snapshot data for customer history
        product: {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
          colorId: { type: mongoose.Schema.Types.ObjectId, required: true },
        },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        nameToPrint: { type: String },
      },
    ],

    // --- Payment and Pricing Details ---
    paymentInfo: {
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
        required: true,
      },
      method: { type: String, required: true, default: "Razorpay" },
      razorpay: {
        orderId: String,
        paymentId: String,
        signature: String,
      },
    },
    pricingInfo: {
      itemsPrice: { type: Number, required: true, default: 0 },
      shippingPrice: { type: Number, required: true, default: 0 },
      taxPrice: { type: Number, required: true, default: 0 },
      discount: { type: Number, required: true, default: 0 },
      totalAmount: { type: Number, required: true, default: 0 },
    },

    // --- Order Status and Tracking (CRITICAL) ---
    orderStatus: {
      type: String,
      enum: ["Processing", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
      required: true,
    },
    shippingDetails: {
      carrier: String,
      trackingNumber: String,
      shippedAt: Date,
      deliveredAt: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
