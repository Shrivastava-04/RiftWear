// backend/routes/admin.routes.js
import express from "express";
import { protect } from "../controllers/user.controller.js"; // Assuming protect middleware
import { authorizeAdmin } from "../middleware/adminAuth.js"; // Import admin authorization middleware
import {
  getAllProductsAdmin,
  getProductDetailsAdmin,
  addProduct,
  deleteProduct,
  getAllUsersAdmin,
  getUserDetailsAdmin,
  updateProduct,
  getAllOrders,
  exportOrders,
  // deleteUser, // if implemented
} from "../controllers/admin.cotroller.js";

const router = express.Router();

// Apply protect and authorizeAdmin middleware to all routes in this router
// router.use(protect, authorizeAdmin); // <--- All routes below this line are protected & admin-only

// Product Management
router.get("/products", getAllProductsAdmin); // Get all products
router.get("/products/:id", getProductDetailsAdmin); // Get single product details
router.post("/products", addProduct); // Add new product
router.put("/updateProduct", updateProduct);
router.delete("/products/:id", deleteProduct); // Delete product
// router.put('/products/:id', updateProduct); // Implement update later if needed

// User Management
router.get("/users", getAllUsersAdmin); // Get all users
router.get("/users/:id", getUserDetailsAdmin); // Get single user details
router.get("/orders", getAllOrders); // New route to get all orders
router.get("/orders/export", exportOrders); // New route for exporting orders

// router.delete('/users/:id', deleteUser); // Delete user (careful!)

export default router;
