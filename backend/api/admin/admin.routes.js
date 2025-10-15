import express from "express";
import {
  getAllUsers,
  getUserById,
  getAllOrders,
  getDashboardStats,
  adminRemoveCartItem,
  deleteUser,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  exportOrders,
} from "./admin.controller.js";
import { updateOrderStatus } from "../orders/order.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/admin.middleware.js";
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  addProductToDepartment,
  removeProductFromDepartment,
  deleteDepartment,
} from "../departments/department.controller.js";
import {
  getAllDrops,
  createDrop,
  updateDrop,
  deleteDrop,
} from "../drops/drop.controller.js";
import {
  getSettings,
  updateSettings,
} from "../siteSetting/siteSetting.controller.js";

const router = express.Router();

// Apply protection to all admin routes
router.use(protectRoute, adminOnly);

// --- User Management Routes ---
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser); // <-- 4. ADD ROUTE for deleting a user

// --- Product Management Routes ---
router.get("/products", getAllProducts);
router.post("/products", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// --- Order Management Routes ---
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

// --- Department Management Routes ----
router.get("/departments", getAllDepartments);
router.post("/departments", createDepartment);
router.put("/departments/:id", updateDepartment);
router.put(
  "/departments/:departmentId/addProductsToDepartment",
  addProductToDepartment
);
router.put(
  "/departments/:departmentId/removeProductsFromDepartment",
  removeProductFromDepartment
); // Reusing the same controller for removal
router.delete("/departments/:id", deleteDepartment);

// --- Drop Management Routes ---
router.get("/drops/all", protectRoute, adminOnly, getAllDrops);
router.post("/drops", protectRoute, adminOnly, createDrop);
router.put("/drops/:id", protectRoute, adminOnly, updateDrop);
router.delete("/drops/:id", protectRoute, adminOnly, deleteDrop);

// --- Site Settings Management Routes ---
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

// --- Dashboard Statistics Route ---
router.get("/stats", getDashboardStats);

// --- 2. ADD THE NEW ROUTE FOR CART MANAGEMENT ---
router.delete("/users/:userId/cart/:cartItemId", adminRemoveCartItem);

router.get("/export-orders", exportOrders);

export default router;
