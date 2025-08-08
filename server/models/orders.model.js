import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      require: true,
      unique: true,
    },
    detailsOfCustomer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    detailsOfProduct: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        size: {
          type: String,
          require: true,
        },
        color: {
          type: String,
          require: true,
        },
        type: {
          type: String,
          require: true,
        },
        quantity: {
          type: Number,
          require: true,
        },
      },
    ],
    amount: {
      type: Number,
      require: true,
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
