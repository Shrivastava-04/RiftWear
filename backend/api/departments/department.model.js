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
      enum: ["IIT (ISM) Dhanbad"],
      // Example: "IIT (ISM) Dhanbad"
    },
    description: {
      type: String,
      trim: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
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
