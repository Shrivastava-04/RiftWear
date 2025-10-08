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
    const { name, college, description } = req.body;

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

    const newDepartment = new Department({ name, college, description });
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
    const { name, college, description, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid department ID format." });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { name, college, description, isActive },
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

export const addProductToDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { productsId } = req.body; // Array of product IDs to add
    console.log(departmentId, productsId);
    console.log("hello");
    // --- 1. Validation ---
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      console.log(departmentId);
      return res.status(400).json({ message: "Invalid department ID format." });
    }
    console.log("step1");
    if (!Array.isArray(productsId) || productsId.length === 0) {
      return res
        .status(400)
        .json({ message: "productsId must be a non-empty array." });
    }

    console.log("step 2");
    // --- 2. Update using $addToSet (Database-level uniqueness) ---
    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      {
        $addToSet: {
          products: { $each: productsId }, // Add each ID from the array if it's not already present
        },
      },
      { new: true } // This option returns the modified document
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found." });
    }

    // --- 3. Respond ---
    console.log("done");
    res.status(200).json({
      success: true,
      message: "Products added to department successfully.",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error("Error adding products to department:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const removeProductFromDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { productsId } = req.body; // Array of product IDs to remove
    // console.log(productsId);
    console.log(departmentId);

    // --- 1. Validation ---
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ message: "Invalid department ID format." });
    }
    if (!Array.isArray(productsId) || productsId.length === 0) {
      return res
        .status(400)
        .json({ message: "productsId must be a non-empty array." });
    }

    // --- 2. Update using $pullAll to remove specified products ---
    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      {
        $pullAll: {
          products: productsId, // Remove all matching IDs from the array
        },
      },
      { new: true } // This option returns the modified document
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found." });
    }

    // --- 3. Respond ---
    res.status(200).json({
      success: true,
      message: "Products removed from department successfully.",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error("Error removing products from department:", error);
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
    const departments = await Department.find(); // Exclude internal fields
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
    const department = await Department.findOne({ _id: id, isActive: true })
      .populate("products")
      .select("-__v -createdAt -updatedAt");
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
