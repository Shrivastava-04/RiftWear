// backend/controllers/admin.controller.js
import mongoose from "mongoose"; // For ObjectId validation
import User from "../models/user.model.js";
import Order from "../models/orders.model.js"; // Ensure Order model is imported
import Product from "../models/product.model.js"; // Assuming you have a Product model
import ExcelJS from "exceljs";

// --- PRODUCTS MANAGEMENT ---

// Get All Products (Admin)
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (error) {
    console.error("Admin: Error fetching all products:", error);
    res.status(500).json({ message: "Failed to fetch products." });
  }
};

// Get Single Product Details (Admin)
export const getProductDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params; // Get product ID from URL params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error("Admin: Error fetching product details:", error);
    res.status(500).json({ message: "Failed to fetch product details." });
  }
};

// Add New Product
const hasAtLeastOneTrue = (obj) => {
  return obj && Object.values(obj).some(Boolean);
};

// Add New Product
export const addProduct = async (req, res) => {
  try {
    // --- UPDATED DESTRUCTURING to include all new fields ---
    const {
      name,
      price,
      originalPrice,
      description,
      images,
      sizes,
      varietyOfProduct,
      colors,
      category,
      isNew,
      onSale,
      rating,
      reviews,
      features,
      specifications,
      forDepartment,
      departmentName,
      sizeChart,
      forHomePage,
    } = req.body;

    // --- REWRITTEN VALIDATION LOGIC ---
    let validationErrors = [];

    // Basic required fields
    if (!name || !price || !description || !category) {
      validationErrors.push(
        "Name, price, description, and category are required."
      );
    }
    // Images array
    if (!images || !Array.isArray(images) || images.length === 0) {
      validationErrors.push("At least one image URL is required.");
    }
    // Sizes object (must have at least one true value)
    if (!hasAtLeastOneTrue(sizes)) {
      validationErrors.push("At least one size must be selected.");
    }
    // Variety object (must have at least one true value)
    if (!hasAtLeastOneTrue(varietyOfProduct)) {
      validationErrors.push("At least one product variety must be selected.");
    }
    // Colors object (must have at least one true value)
    if (!hasAtLeastOneTrue(colors)) {
      validationErrors.push("At least one color must be selected.");
    }
    // Features array
    // if (
    //   !features ||
    //   !Array.isArray(features) ||
    //   features.length === 0 ||
    //   features.some((f) => !f.trim())
    // ) {
    //   validationErrors.push("At least one feature is required.");
    // }
    // Specifications object
    // if (
    //   !specifications ||
    //   !specifications.Material ||
    //   !specifications.Weight ||
    //   !specifications.Fit ||
    //   !specifications.Care
    // ) {
    //   validationErrors.push(
    //     "All specifications (Material, Weight, Fit, Care) are required."
    //   );
    // }
    // Conditional validation for department
    if (forDepartment && !departmentName.trim()) {
      validationErrors.push(
        "Department name is required when 'For Department Store' is checked."
      );
    }
    // Size Chart array
    // if (sizeChart && !Array.isArray(sizeChart)) {
    //   validationErrors.push("Size chart must be an array of URLs.");
    // }

    if (validationErrors.length > 0) {
      console.log(validationErrors);
      return res.status(400).json({ message: validationErrors.join(" ") });
    }

    const newProduct = new Product({
      name,
      price,
      originalPrice,
      description,
      images,
      sizes,
      varietyOfProduct,
      colors,
      category,
      isNew,
      onSale,
      rating,
      reviews,
      features,
      specifications,
      forDepartment,
      departmentName: forDepartment ? departmentName : "", // Save departmentName only if forDepartment is true
      sizeChart,
      forHomePage, // Assuming new products are featured on the homepage by default
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("Admin: Error adding product:", error);
    res.status(500).json({ message: "Failed to add product." });
  }
};

// Update Product

export const updateProduct = async (req, res) => {
  try {
    const { _id, updatedProduct } = req.body;

    const productId =
      _id && typeof _id === "object" && _id.$oid ? _id.$oid : _id;

    if (!productId) {
      return res.status(400).json({ message: "No valid Id" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const product = await Product.findByIdAndUpdate(
      productId, // Use the extracted ID string here
      { ...updatedProduct },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "No product found" });
    }

    res.status(200).json({
      message: "Product Updated",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    // delete associated cart items if any in any user's cart
    await User.updateMany(
      { "cart.productId": id },
      { $pull: { cart: { productId: id } } }
    );
    res.status(200).json({
      message: "Product deleted successfully!",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Admin: Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product." });
  }
};

// --- USERS MANAGEMENT ---

// Get All Users (Admin)
export const getAllUsersAdmin = async (req, res) => {
  try {
    // Fetch all users, but exclude sensitive info like password
    const users = await User.find({}).select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Admin: Error fetching all users:", error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

// Get Single User Details (Admin)
export const getUserDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from URL params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const user = await User.findById(id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Admin: Error fetching user details:", error);
    res.status(500).json({ message: "Failed to fetch user details." });
  }
};

// (Optional: Delete User - Implement if needed)
/*
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User deleted successfully!', user: deletedUser });
    } catch (error) {
        console.error('Admin: Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user.' });
    }
};
*/
// import Order from "../models/order.model.js";

// import Order from "../models/order.model.js";

export const getAllOrders = async (req, res) => {
  try {
    const { sort, startDate, endDate } = req.query;

    const filter = {};
    const hasDateFilter = startDate || endDate;

    if (hasDateFilter) {
      filter.createdAt = {};

      if (startDate) {
        // Parse the start date as UTC to avoid local timezone issues
        const startOfDay = new Date(startDate);
        if (!isNaN(startOfDay.getTime())) {
          // Set to the very start of the day in UTC
          startOfDay.setUTCHours(0, 0, 0, 0);
          filter.createdAt.$gte = startOfDay;
        }
      }
      if (endDate) {
        // Parse the end date as UTC to avoid local timezone issues
        const endOfDay = new Date(endDate);
        if (!isNaN(endOfDay.getTime())) {
          // Set to the very end of the day in UTC
          endOfDay.setUTCHours(23, 59, 59, 999);
          filter.createdAt.$lte = endOfDay;
        }
      }
    }

    const sortOption = sort || "-createdAt";

    const orders = await Order.find(filter)
      .sort(sortOption)
      .populate("detailsOfCustomer", "name email phoneNumber")
      .populate("detailsOfProduct.productId", "name images price");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching all orders for admin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const exportOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // Get startDate and endDate from query parameters

    let query = {}; // Initialize an empty query object

    // If startDate is provided, add it to the query
    if (startDate) {
      query.createdAt = { ...query.createdAt, $gte: new Date(startDate) };
    }

    // If endDate is provided, add it to the query
    if (endDate) {
      // For endDate, set it to the end of the day to include all orders on that day
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { ...query.createdAt, $lte: endOfDay };
    }

    const orders = await Order.find(query) // Apply the date range query
      .sort({ createdAt: -1 })
      .populate("detailsOfCustomer", "name email phoneNumber address") // Populate address
      .populate("detailsOfProduct.productId", "name");
    console.log(orders[0].detailsOfProduct);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    // Define columns
    worksheet.columns = [
      { header: "Token Number", key: "tokenNumber", width: 10 },
      { header: "Order #", key: "orderNumber", width: 20 },
      { header: "Customer Name", key: "customerName", width: 30 },
      { header: "Customer Email", key: "customerEmail", width: 40 },
      { header: "Customer Phone", key: "customerPhone", width: 20 },
      { header: "Customer Address", key: "customerAddress", width: 50 }, // For concatenated address
      { header: "Product Name", key: "productName", width: 40 },
      { header: "Size", key: "size", width: 10 },
      { header: "Color", key: "color", width: 15 },
      { header: "Variety", key: "variety", width: 15 },
      { header: "Quantity", key: "quantity", width: 15 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 },
      { header: "razorpayId", key: "razorpayId", width: 30 },
    ];

    // Add data rows
    let row = 1;
    orders.forEach((order) => {
      // Concatenate address fields
      const customerAddress = order.detailsOfCustomer?.address
        ? [
            order.detailsOfCustomer.address.street,
            order.detailsOfCustomer.address.city,
            order.detailsOfCustomer.address.state,
            order.detailsOfCustomer.address.postalCode,
            order.detailsOfCustomer.address.country,
          ]
            .filter(Boolean) // Remove null or undefined parts
            .join(", ")
        : "N/A";

      order.detailsOfProduct.forEach((item) => {
        worksheet.addRow({
          tokenNumber: row++,
          orderNumber: order.orderNumber,
          customerName: order.detailsOfCustomer?.name || "N/A",
          customerEmail: order.detailsOfCustomer?.email || "N/A",
          customerPhone: order.detailsOfCustomer?.phoneNumber || "N/A",
          customerAddress: customerAddress, // Use the concatenated address
          productName: item.productId?.name || "Unknown Product",
          size: item.size,
          color: item.color,
          variety: item.variety,
          quantity: item.quantity,
          amount: order.amount,
          date: new Date(order.createdAt)
            .toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "-"), // Format date as DD-MM-YYYY
          razorpayId: order.razorpayId,
        });
      });
    });

    // Set headers to trigger file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "orders.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
