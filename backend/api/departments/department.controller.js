import Department from "./department.model.js";
import Product from "../products/product.model.js"; // Needed for safety checks
import mongoose from "mongoose";

// --- ADMIN ONLY FUNCTIONS ---

/**
 * @desc    Create a new department
 * @route   POST /api/v1/departments
 * @access  Private/Admin
 */
export const createDepartment = async (req, res) => {
  try {
    const { name, college, description, image } = req.body;

    if (!name || !college) {
      return res
        .status(400)
        .json({ message: "Department name and college are required." });
    }

    const existingDepartment = await Department.findOne({ name, college });
    if (existingDepartment) {
      return res.status(409).json({
        message: `The department '${name}' already exists for ${college}.`,
      });
    }

    const newDepartment = new Department({ name, college, description, image });
    await newDepartment.save();
    res.status(201).json({
      success: true,
      message: "Department created successfully.",
      department: newDepartment,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

/**
 * @desc    Update a department
 * @route   PUT /api/v1/departments/:id
 * @access  Private/Admin
 */
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, college, description, image, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid department ID format." });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { name, college, description, image, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found." });
    }

    res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

/**
 * @desc    Delete a department (with safety check)
 * @route   DELETE /api/v1/departments/:id
 * @access  Private/Admin
 */
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid department ID format." });
    }

    const departmentToDelete = await Department.findById(id);
    if (!departmentToDelete) {
      return res.status(404).json({ message: "Department not found." });
    }

    // --- CRITICAL SAFETY CHECK ---
    // Check if any product is still assigned to this department before deleting.
    const productInDepartment = await Product.findOne({
      "category.type": "College Store",
      "category.college": departmentToDelete.college,
      "category.department": departmentToDelete.name,
    });

    if (productInDepartment) {
      return res.status(400).json({
        message:
          "Cannot delete department. Products are still assigned to it. Please reassign products or deactivate the department.",
      });
    }

    await Department.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Department deleted successfully." });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// --- PUBLIC FUNCTIONS ---

/**
 * @desc    Get all active departments
 * @route   GET /api/v1/departments
 * @access  Public
 */
export const getAllDepartments = async (req, res) => {
  try {
    // Only return departments that are marked as active
    const departments = await Department.find();
    res.status(200).json({ success: true, departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

/**
 * @desc    Get a single department by its ID
 * @route   GET /api/v1/departments/:id
 * @access  Public
 */
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid department ID." });
    }
    const department = await Department.findOne({ _id: id, isActive: true });
    if (!department) {
      return res
        .status(404)
        .json({ message: "Department not found or is not active." });
    }
    res.status(200).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};
