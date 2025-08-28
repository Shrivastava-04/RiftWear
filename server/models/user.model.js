// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: false,
//     },
//     phoneNumber: {
//       type: String,
//       sparse: true,
//       required: false,
//     },
//     address: {
//       street: {
//         type: String,
//         required: false,
//       },
//       city: {
//         type: String,
//         required: false,
//       },
//       state: {
//         type: String,
//         required: false,
//       },
//       postalCode: {
//         type: String,
//         required: false,
//       },
//       country: {
//         type: String,
//         required: false,
//       },
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//     // --- UPDATED 'cartItem' FIELD ---
//     cartItem: [
//       {
//         productId: {
//           type: mongoose.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           default: 1,
//         },
//         size: {
//           type: String,
//         },
//         variety: {
//           type: String,
//         },
//         color: {
//           // Changed to an object to store color details
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
//       },
//     ],
//     // -------------------------------
//     order: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "Order",
//       },
//     ],
//     googleId: {
//       type: String,
//       unique: true,
//       sparse: true,
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);
// export default User;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      sparse: true,
      required: false,
    },
    address: {
      // No changes here
      street: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      postalCode: { type: String, required: false },
      country: { type: String, required: false },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // --- ONLY COMPULSORY CHANGES ARE HERE ---
    cartItem: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        // ADDED: This is the _id of the chosen object in the product's 'variants' array.
        // This is the most crucial field.
        variantId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        size: {
          type: String,
          required: true, // Size is still needed
        },
        // ADDED: A simple string to identify the chosen color within the variant.
        colorName: {
          type: String,
          required: true,
        },
        // REMOVED: The old 'variety' and 'color' object are replaced by variantId and colorName.
      },
    ],
    // -----------------------------------------

    order: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
    ],
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
