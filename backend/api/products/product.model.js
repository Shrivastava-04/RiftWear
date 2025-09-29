import mongoose from "mongoose";

// --- Sub-schema for Reviews ---
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// --- Sub-schema for Product Variants (e.g., Oversized, Regular) ---
const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Regular", "Oversized", "Polo", "Hoodie"], // Your existing variants
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  // --- Inventory Management per Color/Size ---
  colors: [
    {
      name: { type: String, required: true, trim: true },
      images: [{ type: String, required: true }],
      stock: [
        {
          size: {
            type: String,
            required: true,
            enum: ["S", "M", "L", "XL", "XXL"],
          },
          quantity: { type: Number, required: true, default: 0, min: 0 },
        },
      ],
    },
  ],
  features: [{ type: String }],
  specifications: {
    Material: String,
    Weight: String,
    Fit: String,
    Care: String,
  },
  sizeChart: [{ type: String, required: true }],
});

// --- Main Product Schema ---
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
    // --- Advanced Categorization ---
    category: {
      type: {
        type: String,
        required: true,
        enum: ["Fashion", "College Store"],
      },
      collection: {
        type: String,
        // Only allow these values if the type is 'Fashion'
        enum: [null, "Anime Collection", "Casuals", "Minimalist"],
        default: null,
      },
      subCollection: {
        type: String,
        // Only allow these values if the collection is 'Anime Collection'
        enum: [null, "Naruto", "Jujutsu Kaisen", "One Piece"],
        default: null,
      },
      college: {
        type: String,
        enum: [null, "IIT (ISM) Dhanbad"],
        default: null,
      },
      department: {
        type: String,
        enum: [
          null,
          "Computer Science",
          "Mechanical Engineering",
          "Electrical Engineering",
          "Civil Engineering",
          "Mining Engineering",
          "Chemical Engineering",
          "Electronics & Communication",
          "Petroleum Engineering",
          "Mathematics & Computing",
          "Physics",
        ],
        default: null,
      },
    },

    // --- Product Variants ---
    variants: [variantSchema],

    // --- Reviews and Ratings ---
    reviews: [reviewSchema],
    rating: {
      // Average rating, calculated automatically
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },

    // --- NEW FIELD FOR SAFE DELETION ---

    isActive: {
      type: Boolean,
      default: true, // All new products are active by default
    },

    // --- NEW FIELD FOR MANUAL SORTING ---
    sortPriority: {
      type: Number,
      default: 99, // A high default means new items go to the end unless specified.
    },

    // --- Metadata for Filtering ---
    isNew: {
      type: Boolean,
      default: true,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    forHomePage: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
