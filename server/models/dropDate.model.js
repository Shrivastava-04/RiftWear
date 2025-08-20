import mongoose from "mongoose";

const dropDateSchema = new mongoose.Schema(
  {
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const DropDate = mongoose.model("DropDate", dropDateSchema);
export default DropDate;
