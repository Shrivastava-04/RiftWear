import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  sizes: {
    S: {
      type: Boolean,
      default: false,
    },
    M: {
      type: Boolean,
      default: false,
    },
    L: {
      type: Boolean,
      default: false,
    },
    XL: {
      type: Boolean,
      default: false,
    },
    XXL: {
      type: Boolean,
      default: false,
    },
  },
  varietyOfProduct: {
    Regular: {
      type: Boolean,
      default: false,
    },
    Oversized: {
      type: Boolean,
      default: false,
    },
    Polo: {
      type: Boolean,
      default: false,
    },
    Hoodie: {
      type: Boolean,
      default: false,
    },
  },
  colors: {
    Black: {
      type: Boolean,
      default: false,
    },
    White: {
      type: Boolean,
      default: false,
    },
  },
  category: {
    type: String,
    required: true,
  },
  isNew: {
    type: Boolean,
    default: true,
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  features: [
    {
      type: String,
      required: true,
    },
  ],
  specifications: {
    Material: { type: String, required: true },
    Weight: { type: String, required: true },
    Fit: { type: String, required: true },
    Care: { type: String, required: true },
  },
  forDepartment: {
    type: Boolean,
    default: false,
  },
  departmentName: {
    type: String,
    default: "",
  },
  sizeChart: [
    {
      type: String,
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

export default Product;
