import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
      // Example: "IIT (ISM) Dhanbad"
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // URL for a department-specific banner or logo
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    // Ensures that no two departments have the same name within the same college
    indexes: [{ unique: true, fields: ["name", "college"] }],
  }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;
