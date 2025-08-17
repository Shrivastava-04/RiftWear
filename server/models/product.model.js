import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
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
      // **Remove `required: true` from here to allow defaults to be used**
      Material: { type: String, default: "100% Cotton" },
      Weight: { type: String, default: "180 GSM" },
      Fit: { type: String, default: "Round Neck, Regular Fit" },
      Care: { type: String, default: "Machine washed" },
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
        default:
          "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1755197627/sigrfjjydtlpmbmdexo8.png",
      },
    ],
    forHomePage: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
