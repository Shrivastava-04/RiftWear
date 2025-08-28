// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     orderNumber: {
//       type: String,
//       require: true,
//       unique: true,
//     },
//     detailsOfCustomer: {
//       type: mongoose.Types.ObjectId,
//       ref: "User",
//       require: true,
//     },
//     // --- UPDATED 'detailsOfProduct' FIELD ---
//     detailsOfProduct: [
//       {
//         productId: {
//           type: mongoose.Types.ObjectId,
//           ref: "Product",
//           require: true,
//         },
//         size: {
//           type: String,
//           require: true,
//         },
//         variety: {
//           type: String,
//           require: true,
//         },
//         // Updated 'color' field to store color details
//         color: {
//           name: {
//             type: String,
//             required: true,
//           },
//           images: [
//             {
//               type: String,
//             },
//           ],
//         },
//         quantity: {
//           type: Number,
//           require: true,
//         },
//       },
//     ],
//     // ----------------------------------------
//     amount: {
//       type: Number,
//       require: true,
//     },
//     razorpayId: {
//       type: String,
//       default: "Razorpay",
//     },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model("Order", orderSchema);
// export default Order;
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
