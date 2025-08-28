// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     originalPrice: {
//       type: Number,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     images: [
//       {
//         type: String,
//       },
//     ],
//     sizes: {
//       S: {
//         type: Boolean,
//         default: false,
//       },
//       M: {
//         type: Boolean,
//         default: false,
//       },
//       L: {
//         type: Boolean,
//         default: false,
//       },
//       XL: {
//         type: Boolean,
//         default: false,
//       },
//       XXL: {
//         type: Boolean,
//         default: false,
//       },
//     },
//     varietyOfProduct: {
//       Regular: {
//         type: Boolean,
//         default: false,
//       },
//       Oversized: {
//         type: Boolean,
//         default: false,
//       },
//       Polo: {
//         type: Boolean,
//         default: false,
//       },
//       Hoodie: {
//         type: Boolean,
//         default: false,
//       },
//     },
//     // Updated 'colors' field to store color variants and their images
//     colors: [
//       {
//         name: {
//           type: String,
//           required: true,
//           trim: true,
//         },
//         images: [
//           {
//             type: String,
//             required: true,
//           },
//         ],
//       },
//     ],
//     category: {
//       type: String,
//       required: true,
//     },
//     isNew: {
//       type: Boolean,
//       default: true,
//     },
//     onSale: {
//       type: Boolean,
//       default: false,
//     },
//     rating: {
//       type: Number,
//       default: 0,
//     },
//     reviews: {
//       type: Number,
//       default: 0,
//     },
//     features: [
//       {
//         type: String,
//         required: true,
//       },
//     ],
//     specifications: {
//       // **Note: `required: true` on nested fields means the parent object is required if defined,
//       // but individual nested fields are not required if the parent is not present.
//       // If you want to enforce these fields, ensure your frontend always sends them.
//       Material: { type: String, required: true },
//       Weight: { type: String, required: true },
//       Fit: { type: String, required: true },
//       Care: { type: String, required: true },
//     },
//     forDepartment: {
//       type: Boolean,
//       default: false,
//     },
//     departmentName: {
//       type: String,
//       default: "",
//     },
//     sizeChart: [
//       {
//         type: String,
//         required: true,
//       },
//     ],
//     forHomePage: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// const Product = mongoose.model("Product", productSchema);

// export default Product;
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
      S: { type: Boolean, default: false },
      M: { type: Boolean, default: false },
      L: { type: Boolean, default: false },
      XL: { type: Boolean, default: false },
      XXL: { type: Boolean, default: false },
    },
    variants: [
      {
        name: {
          type: String,
          required: true,
          enum: ["Regular", "Oversized", "Polo", "Hoodie"],
        },
        price: {
          type: Number,
          required: true,
        },
        originalPrice: {
          type: Number,
          required: true,
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
        colors: [
          {
            name: {
              type: String,
              required: true,
              trim: true,
            },
            images: [
              {
                type: String,
                required: true,
              },
            ],
          },
        ],
        // MOVED sizeChart INSIDE each variant
        sizeChart: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],
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
    forDepartment: {
      type: Boolean,
      default: false,
    },
    departmentName: {
      type: String,
      default: "",
    },
    forHomePage: {
      type: Boolean,
      default: false,
    },
    // NOTE: Top-level 'sizeChart' field has been removed.
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
