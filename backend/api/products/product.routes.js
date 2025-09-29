import express from "express";
import {
  getAllProducts,
  getProductById,
  addProductReview,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/admin.middleware.js";

const router = express.Router();

// --- PUBLIC ROUTES (accessible to everyone) ---
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// --- USER PROTECTED ROUTE (accessible to any logged-in user) ---
router.post("/:id/reviews", protectRoute, addProductReview);

// --- ADMIN PROTECTED ROUTES (accessible only to logged-in admins) ---
router.post("/", protectRoute, adminOnly, addProduct);
router.put("/:id", protectRoute, adminOnly, updateProduct);
router.delete("/:id", protectRoute, adminOnly, deleteProduct);

export default router;
