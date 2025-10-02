import mongoose from "mongoose";

// A more robust schema for handling multiple, detailed user addresses
const addressSchema = new mongoose.Schema({
  addressType: {
    type: String,
    enum: ["Home", "Work", "Other"],
    default: "Home",
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  landmark: {
    type: String, // Optional but helpful for delivery
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "India",
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

// Schema for items in the user's shopping cart
const cartItemSchema = new mongoose.Schema({
  product: {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId, // Refers to the specific variant within the product
      required: true,
    },
    colorId: {
      type: mongoose.Schema.Types.ObjectId, // Refers to the specific color within the variant
      required: true,
    },
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  nameToPrint: {
    type: String, // For custom text on products
  },
});

// The main user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String, // Not required for Google OAuth users
    },
    phoneNumber: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // --- E-commerce Features ---
    addresses: [addressSchema], // Array for multiple shipping addresses
    cart: [cartItemSchema],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    // --- Account Management ---
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
