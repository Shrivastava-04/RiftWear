// import Department from "../models/department.model.js";
// import mongoose from "mongoose"; // Import mongoose for ID validation

// export const createDepartment = async (req, res) => {
//   try {
//     const { name, productId, productIsAvailable } = req.body;

//     // Basic validation
//     if (!name) {
//       return res.status(400).json({ message: "Department name is required." });
//     }

//     // Check if department with this name already exists
//     const existingDepartment = await Department.findOne({ name: name });
//     if (existingDepartment) {
//       return res
//         .status(409)
//         .json({ message: "Department with this name already exists." });
//     }

//     // Validate productId if provided
//     if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({ message: "Invalid product ID format." });
//     }

//     const newDepartment = new Department({
//       name,
//       productId: productId || null, // Allow productId to be optional
//       productIsAvailable:
//         productIsAvailable !== undefined ? productIsAvailable : false, // Default to false if not provided
//     });
//     await newDepartment.save();
//     res.status(201).json({
//       // Use 201 for successful creation
//       message: "Department created successfully",
//       department: newDepartment,
//     });
//   } catch (error) {
//     console.error("Error creating department:", error);
//     res.status(500).json({ message: "Internal Server Error." });
//   }
// };

// export const getDepartments = async (req, res) => {
//   try {
//     const departments = await Department.find().populate(
//       "productId",
//       "name images _id description price originalPrice category onSale newArrival" // Populate only necessary fields from Product
//     ); // Populate product details
//     res.status(200).json(departments);
//   } catch (error) {
//     console.error("Error fetching departments:", error);
//     res.status(500).json({ message: "Internal Server Error." });
//   }
// };

// export const updateDepartment = async (req, res) => {
//   try {
//     const { id } = req.query; // Department ID from URL
//     const { name, productId, productIsAvailable } = req.body; // Updated fields

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid department ID format." });
//     }

//     // Check if another department with the same name already exists (if name is being changed)
//     if (name) {
//       const existingDepartment = await Department.findOne({ name: name });
//       if (existingDepartment && existingDepartment._id.toString() !== id) {
//         return res.status(409).json({
//           message: "Another department with this name already exists.",
//         });
//       }
//     }

//     // Validate productId if provided
//     if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({ message: "Invalid product ID format." });
//     }

//     const updatedDepartment = await Department.findByIdAndUpdate(
//       id,
//       {
//         name,
//         productId: productId || null, // Allow productId to be set to null if empty
//         productIsAvailable,
//       },
//       { new: true, runValidators: true } // Return the updated doc, run schema validators
//     );

//     if (!updatedDepartment) {
//       return res.status(404).json({ message: "Department not found." });
//     }

//     res.status(200).json({
//       message: "Department updated successfully",
//       department: updatedDepartment,
//     });
//   } catch (error) {
//     console.error("Error updating department:", error);
//     res.status(500).json({ message: "Internal Server Error." });
//   }
// };

// export const deleteDepartment = async (req, res) => {
//   try {
//     const { id } = req.query; // Department ID from URL

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid department ID format." });
//     }

//     const deletedDepartment = await Department.findByIdAndDelete(id);

//     if (!deletedDepartment) {
//       return res.status(404).json({ message: "Department not found." });
//     }

//     res.status(200).json({ message: "Department deleted successfully." });
//   } catch (error) {
//     console.error("Error deleting department:", error);
//     res.status(500).json({ message: "Internal Server Error." });
//   }
// };
import Department from "../models/department.model.js";
import mongoose from "mongoose";

// Helper function to validate an array of ObjectIds
const validateProductIds = (productIds) => {
  if (!Array.isArray(productIds)) {
    return false;
  }
  for (const id of productIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
  }
  return true;
};

export const createDepartment = async (req, res) => {
  try {
    const { name, productId, productIsAvailable } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Department name is required." });
    }

    const existingDepartment = await Department.findOne({ name: name });
    if (existingDepartment) {
      return res
        .status(409)
        .json({ message: "Department with this name already exists." });
    }

    // --- UPDATED: Validate productId as an array ---
    if (productId && !validateProductIds(productId)) {
      return res.status(400).json({
        message:
          "Invalid product ID format. Must be an array of valid ObjectIds.",
      });
    }

    const newDepartment = new Department({
      name,
      productId: productId || [], // Default to an empty array if not provided
      productIsAvailable:
        productIsAvailable !== undefined ? productIsAvailable : false,
    });
    await newDepartment.save();
    res.status(201).json({
      message: "Department created successfully",
      department: newDepartment,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate(
      "productId",
      "name images _id description category variants onSale newArrival"
    );
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, productId, productIsAvailable } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid department ID format." });
    }

    if (name) {
      const existingDepartment = await Department.findOne({ name: name });
      if (existingDepartment && existingDepartment._id.toString() !== id) {
        return res.status(409).json({
          message: "Another department with this name already exists.",
        });
      }
    }

    // --- UPDATED: Validate productId as an array ---
    if (productId && !validateProductIds(productId)) {
      return res.status(400).json({
        message:
          "Invalid product ID format. Must be an array of valid ObjectIds.",
      });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      {
        name,
        productId: productId !== undefined ? productId : null, // Set to the new array, or null if needed
        productIsAvailable,
      },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found." });
    }

    res.status(200).json({
      message: "Department updated successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid department ID format." });
    }

    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found." });
    }

    res.status(200).json({ message: "Department deleted successfully." });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
