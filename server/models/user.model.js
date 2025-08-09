import mongoose, { Schema } from "mongoose";

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
    // The address is now a single object with its own properties
    address: {
      street: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      postalCode: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cartItem: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        size: {
          type: String,
        },
        variety: {
          type: String,
        },
        color: {
          type: String,
        },
      },
    ],
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
