import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress,
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUserOrders,
  canUserReviewProduct,
} from "./user.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Apply the protectRoute middleware to all routes in this file
// This ensures that a user must be logged in to access any of these endpoints
router.use(protectRoute);

// --- Profile Routes ---
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

// --- Address Routes ---
router.post("/addresses", addAddress);
router.delete("/addresses/:addressId", deleteAddress);

// --- Cart Routes ---
router.get("/cart", getCart);
router.post("/cart", addToCart);
router.put("/cart", updateCartItem); // Using PUT for updates
router.delete("/cart/:cartItemId", deleteCartItem);

// --- Wishlist Routes --- Not implemented right now ---
router.get("/wishlist", getWishlist);
router.post("/wishlist", addToWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

// --- Order Routes ---
router.get("/orders", getUserOrders);

// Checks if a user has purchased a product and is eligible to review it
router.get("/can-review/:productId", canUserReviewProduct);

export default router;
