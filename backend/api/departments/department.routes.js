import express from "express";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  addProductToDepartment,
  removeProductFromDepartment,
} from "./department.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/admin.middleware.js";

const router = express.Router();

// --- PUBLIC ROUTES (accessible to everyone) ---
router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);

// --- ADMIN PROTECTED ROUTES (accessible only to logged-in admins) ---
router.post("/", protectRoute, adminOnly, createDepartment);
router.put("/:id", protectRoute, adminOnly, updateDepartment);
router.put(
  "/:id/addProductsToDepartment",
  protectRoute,
  adminOnly,
  addProductToDepartment
);
router.put(
  "/:id/removeProductsFromDepartment",
  protectRoute,
  adminOnly,
  removeProductFromDepartment
); // Reusing the same controller for removal
router.delete("/:id", protectRoute, adminOnly, deleteDepartment);

export default router;
