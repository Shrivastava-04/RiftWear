// import mongoose from "mongoose";

// const departmentSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     require: true,
//     unique: true,
//   },
//   productId: {
//     type: mongoose.Types.ObjectId,
//     ref: "Product",
//   },
//   productIsAvailable: {
//     type: Boolean,
//     default: false,
//     require: true,
//   },
// });

// const Department = mongoose.model("Department", departmentSchema);
// export default Department;
import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  // --- UPDATED FIELD ---
  productId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
  ],
  // --------------------
  productIsAvailable: {
    type: Boolean,
    default: false,
    require: true,
  },
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;
