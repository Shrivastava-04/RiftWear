import mongoose from "mongoose";

const dropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      // Example: "Fall 2024 College Drop"
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    // An explicit status to control payment availability.
    // This allows an admin to manually start/stop a drop.
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Drop = mongoose.model("Drop", dropSchema);
export default Drop;
