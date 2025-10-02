import Product from "./product.model.js";
import User from "../users/user.model.js"; // Needed for reviews
import Order from "../orders/order.model.js"; // Needed for safe deletion
import mongoose from "mongoose";
import Department from "../departments/department.model.js";

// --- PUBLIC: Functions for any user ---

/**
 * @desc    Fetch all products with advanced filtering and pagination
 * @route   GET /api/v1/products
 * @access  Public
 * @example /api/v1/products?categoryType=Fashion&collection=Anime&page=1&limit=10
 */
// in backend/api/products/product.controller.js
export const getAllProducts = async (req, res) => {
  try {
    const {
      categoryType,
      sortBy = "sortPriority", // Default sort by admin-defined priority
      sortOrder = "asc",
      isActive = "all",
    } = req.query;
    const filter = {};

    // --- Advanced Filtering Logic ---
    if (categoryType && categoryType !== "all") {
      filter["category.type"] = categoryType;
    }
    // Admin can request products based on their active status
    if (isActive !== "all") {
      filter.isActive = isActive === "true";
    }

    // --- Advanced Sorting Logic ---
    const sort = {};
    if (sortBy === "price") {
      sort["variants.0.price"] = sortOrder === "asc" ? 1 : -1;
    } else {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const products = await Product.find(filter).sort(sort);

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ message: "Server error fetching products." });
  }
};

/**
 * @desc    Fetch a single product by its ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ message: "Server error fetching product details." });
  }
};

// --- USER: Functions for logged-in users ---

/**
 * @desc    Create a new product review
 * @route   POST /api/v1/products/:id/reviews
 * @access  Private (requires user login)
 */
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id: productId } = req.params;
    const user = req.user; // Attached from protectRoute middleware

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found." });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === user._id.toString()
    );
    if (alreadyReviewed)
      return res
        .status(400)
        .json({ message: "You have already reviewed this product." });

    const review = {
      user: user._id,
      name: user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res
      .status(201)
      .json({ success: true, message: "Review added successfully." });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ message: "Server error while adding review." });
  }
};

// --- ADMIN: Functions for admin users only ---

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
export const addProduct = async (req, res) => {
  try {
    // The request body should match the structure of the product model
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    if (newProduct.category.type === "College Store") {
      const department = await Department.findOne({
        name: newProduct.category.department,
        college: newProduct.category.college,
      });
      if (department) {
        department.products.push(savedProduct._id);
        await department.save();
      }
    }
    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res
      .status(400)
      .json({ message: "Error creating product.", error: error.message });
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/v1/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true, // Return the modified document
      runValidators: true, // Run schema validators on update
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res
      .status(400)
      .json({ message: "Error updating product.", error: error.message });
  }
};

/**
 * @desc    Delete or Archive a product safely
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    // 1. Clean up user carts and wishlists immediately
    // This removes the product regardless of whether we hard or soft delete it.
    await User.updateMany(
      {},
      {
        $pull: {
          cart: { productId: productId },
          wishlist: productId,
        },
      }
    );

    // 2. Check if the product is part of any order
    const productInOrders = await Order.findOne({
      "items.productId": productId,
    });

    if (productInOrders) {
      // --- SOFT DELETE: Product is in an order, so we archive it ---
      // We keep the product data for historical records but hide it from the store.
      const archivedProduct = await Product.findByIdAndUpdate(
        productId,
        { isActive: false },
        { new: true }
      );

      if (!archivedProduct) {
        return res
          .status(404)
          .json({ message: "Product not found to archive." });
      }

      res.status(200).json({
        success: true,
        message: "Product is part of an order and has been archived.",
      });
    } else {
      // --- HARD DELETE: Product is not in any order, so it's safe to delete completely ---
      const deletedProduct = await Product.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return res
          .status(404)
          .json({ message: "Product not found to delete." });
      }

      res.status(200).json({
        success: true,
        message: "Product deleted successfully from the database.",
      });
    }
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server error during product deletion." });
  }
};
