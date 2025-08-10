import express from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from "../controllers/department.controller.js";

const router = express.Router();

router.post("/create-department", createDepartment); // Create a new department
router.get("/get-department", getDepartments); // Get all departments
router.put("/update-department", updateDepartment); // Update a department by ID
router.delete("/delete-department", deleteDepartment); // Delete a department by ID

export default router;
