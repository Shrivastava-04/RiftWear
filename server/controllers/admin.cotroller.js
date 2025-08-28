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
    const { id } = req.params;

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
// export const addProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       price,
//       originalPrice,
//       description,
//       images,
//       sizes,
//       varietyOfProduct,
//       colors, // This will now be an array of objects from the frontend
//       category,
//       isNew,
//       onSale,
//       rating,
//       reviews,
//       features,
//       specifications,
//       forDepartment,
//       departmentName,
//       sizeChart,
//       forHomePage,
//     } = req.body;

//     // --- REWRITTEN VALIDATION LOGIC for new 'colors' field ---
//     let validationErrors = [];

//     if (!name || !price || !description || !category) {
//       validationErrors.push(
//         "Name, price, description, and category are required."
//       );
//     }
//     if (!images || !Array.isArray(images) || images.length === 0) {
//       validationErrors.push("At least one main image URL is required.");
//     }

//     // Validate if the sizes object has at least one 'true' value
//     const hasAtLeastOneTrue = (obj) => obj && Object.values(obj).some(Boolean);

//     if (!hasAtLeastOneTrue(sizes)) {
//       validationErrors.push("At least one size must be selected.");
//     }
//     if (!hasAtLeastOneTrue(varietyOfProduct)) {
//       validationErrors.push("At least one product variety must be selected.");
//     }

//     // New Validation for 'colors' array
//     if (!colors || !Array.isArray(colors) || colors.length === 0) {
//       validationErrors.push("At least one color variant is required.");
//     } else {
//       // Validate that each color variant has a name and at least one image
//       const invalidColor = colors.some(
//         (color) =>
//           !color.name ||
//           !color.images ||
//           !Array.isArray(color.images) ||
//           color.images.length === 0
//       );
//       if (invalidColor) {
//         validationErrors.push(
//           "Each color variant must have a name and at least one image."
//         );
//       }
//     }

//     if (forDepartment && !departmentName.trim()) {
//       validationErrors.push(
//         "Department name is required when 'For Department Store' is checked."
//       );
//     }

//     if (validationErrors.length > 0) {
//       console.log(validationErrors);
//       return res.status(400).json({ message: validationErrors.join(" ") });
//     }

//     const newProduct = new Product({
//       name,
//       price,
//       originalPrice,
//       description,
//       images,
//       sizes,
//       varietyOfProduct,
//       colors,
//       category,
//       isNew,
//       onSale,
//       rating,
//       reviews,
//       features,
//       specifications,
//       forDepartment,
//       departmentName: forDepartment ? departmentName : "",
//       sizeChart,
//       forHomePage,
//     });
//     // console.log(newProduct);

//     await newProduct.save();
//     res
//       .status(201)
//       .json({ message: "Product added successfully!", product: newProduct });
//   } catch (error) {
//     console.error("Admin: Error adding product:", error);
//     res.status(500).json({ message: "Failed to add product." });
//   }
// };
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      images,
      sizes,
      variants, // The frontend will now send sizeChart inside each variant object
      category,
      isNew,
      onSale,
      forDepartment,
      departmentName,
      forHomePage,
    } = req.body;

    const validationErrors = [];

    // 1. --- VALIDATE TOP-LEVEL FIELDS (Unchanged) ---
    if (!name || !description || !category) {
      validationErrors.push("Name, description, and category are required.");
    }
    if (!images || !Array.isArray(images) || images.length === 0) {
      validationErrors.push("At least one main product image is required.");
    }
    if (!sizes || !Object.values(sizes).some(Boolean)) {
      validationErrors.push("At least one size must be selected.");
    }

    // 2. --- VALIDATE THE VARIANTS ARRAY ---
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      validationErrors.push("At least one product variant is required.");
    } else {
      // 3. --- VALIDATE EACH VARIANT OBJECT (Now includes sizeChart validation) ---
      for (const variant of variants) {
        if (
          !variant.name ||
          !variant.price ||
          !variant.originalPrice ||
          !variant.features ||
          !variant.specifications ||
          !variant.colors ||
          !variant.sizeChart // ADDED: Check for sizeChart
        ) {
          validationErrors.push(
            "Each variant must have a name, price, features, specifications, colors, and a size chart."
          );
          break; // Stop checking after the first invalid variant
        }
        if (variant.features.length === 0) {
          validationErrors.push(
            `Variant "${variant.name}" must have at least one feature.`
          );
        }
        if (variant.colors.length === 0) {
          validationErrors.push(
            `Variant "${variant.name}" must have at least one color.`
          );
        }
        // ADDED: Validate size chart is not empty
        if (variant.sizeChart.length === 0) {
          validationErrors.push(
            `Variant "${variant.name}" must have a size chart image.`
          );
        }
        // Validate each color within the variant
        for (const color of variant.colors) {
          if (!color.name || !color.images || color.images.length === 0) {
            validationErrors.push(
              `Each color in variant "${variant.name}" must have a name and at least one image.`
            );
          }
        }
      }
    }

    if (forDepartment && (!departmentName || !departmentName.trim())) {
      validationErrors.push(
        "Department name is required when 'For Department Store' is checked."
      );
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join("\n") });
    }

    // 4. --- CREATE AND SAVE THE NEW PRODUCT ---
    const newProduct = new Product({
      name,
      description,
      images,
      sizes,
      category,
      isNew,
      onSale,
      forDepartment,
      departmentName: forDepartment ? departmentName : "",
      forHomePage,
      variants, // Pass the entire validated variants array
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("Admin: Error adding product:", error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "A product with this name might already exist." });
    }
    res.status(500).json({ message: "Failed to add product." });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { _id, updatedProduct } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    // Find and update the product by its ID
    const product = await Product.findByIdAndUpdate(
      _id,
      { ...updatedProduct },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "No product found." });
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

    // Delete associated cart items from all users' carts
    await User.updateMany(
      { "cartItem.productId": id },
      { $pull: { cartItem: { productId: id } } }
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

// Get All Users (Admin)
export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Admin: Error fetching all users:", error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

// Get Single User Details (Admin)
// export const getUserDetailsAdmin = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid user ID format." });
//     }

//     const user = await User.findById(id).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }
//     res.status(200).json({ user });
//   } catch (error) {
//     console.error("Admin: Error fetching user details:", error);
//     res.status(500).json({ message: "Failed to fetch user details." });
//   }
// };
// in admin.controller.js
export const getUserDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    // This .populate() is essential for the cart section to work
    const user = await User.findById(id).select("-password").populate({
      path: "cartItem.productId",
      model: "Product",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    // ... error handling
    console.error("Admin: Error fetching user details:", error);
    res.status(500).json({ message: "Failed to fetch user details." });
  }
};

// Get All Orders (Admin)
// export const getAllOrders = async (req, res) => {
//   try {
//     const { sort, startDate, endDate } = req.query;

//     const filter = {};
//     const hasDateFilter = startDate || endDate;

//     if (hasDateFilter) {
//       filter.createdAt = {};

//       if (startDate) {
//         const startOfDay = new Date(startDate);
//         if (!isNaN(startOfDay.getTime())) {
//           startOfDay.setUTCHours(0, 0, 0, 0);
//           filter.createdAt.$gte = startOfDay;
//         }
//       }
//       if (endDate) {
//         const endOfDay = new Date(endDate);
//         if (!isNaN(endOfDay.getTime())) {
//           endOfDay.setUTCHours(23, 59, 59, 999);
//           filter.createdAt.$lte = endOfDay;
//         }
//       }
//     }

//     const sortOption = sort || "-createdAt";

//     const orders = await Order.find(filter)
//       .sort(sortOption)
//       .populate("detailsOfCustomer", "name email phoneNumber")
//       .populate("detailsOfProduct.productId", "name images price");

//     res.status(200).json({ orders });
//   } catch (error) {
//     console.error("Error fetching all orders for admin:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
export const getAllOrders = async (req, res) => {
  try {
    const { sort, startDate, endDate } = req.query;

    const filter = {};
    const hasDateFilter = startDate || endDate;

    if (hasDateFilter) {
      filter.createdAt = {};

      if (startDate) {
        const startOfDay = new Date(startDate);
        if (!isNaN(startOfDay.getTime())) {
          startOfDay.setUTCHours(0, 0, 0, 0);
          filter.createdAt.$gte = startOfDay;
        }
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        if (!isNaN(endOfDay.getTime())) {
          endOfDay.setUTCHours(23, 59, 59, 999);
          filter.createdAt.$lte = endOfDay;
        }
      }
    }

    const sortOption = sort || "-createdAt";

    const orders = await Order.find(filter)
      .sort(sortOption)
      // UPDATED: Changed "detailsOfCustomer" to "customer"
      .populate("customer", "name email");
    // REMOVED: No longer need to populate product details for the list view,
    // as the snapshot is stored directly in the order's 'items' array.

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching all orders for admin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const exportOrders = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     let query = {};

//     if (startDate) {
//       query.createdAt = { ...query.createdAt, $gte: new Date(startDate) };
//     }

//     if (endDate) {
//       const endOfDay = new Date(endDate);
//       endOfDay.setHours(23, 59, 59, 999);
//       query.createdAt = { ...query.createdAt, $lte: endOfDay };
//     }

//     const orders = await Order.find(query)
//       .sort({ createdAt: -1 })
//       .populate("detailsOfCustomer", "name email phoneNumber address")
//       .populate("detailsOfProduct.productId", "name");

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Orders");

//     worksheet.columns = [
//       { header: "Token Number", key: "tokenNumber", width: 10 },
//       { header: "Order #", key: "orderNumber", width: 20 },
//       { header: "Customer Name", key: "customerName", width: 30 },
//       { header: "Customer Email", key: "customerEmail", width: 40 },
//       { header: "Customer Phone", key: "customerPhone", width: 20 },
//       { header: "Customer Address", key: "customerAddress", width: 50 },
//       { header: "Product Name", key: "productName", width: 40 },
//       { header: "Size", key: "size", width: 10 },
//       { header: "Color", key: "color", width: 15 },
//       { header: "Variety", key: "variety", width: 15 },
//       { header: "Quantity", key: "quantity", width: 15 },
//       { header: "Amount", key: "amount", width: 15 },
//       { header: "Date", key: "date", width: 20 },
//       { header: "razorpayId", key: "razorpayId", width: 30 },
//     ];

//     let row = 1;
//     orders.forEach((order) => {
//       const customerAddress = order.detailsOfCustomer?.address
//         ? [
//             order.detailsOfCustomer.address.street,
//             order.detailsOfCustomer.address.city,
//             order.detailsOfCustomer.address.state,
//             order.detailsOfCustomer.address.postalCode,
//             order.detailsOfCustomer.address.country,
//           ]
//             .filter(Boolean)
//             .join(", ")
//         : "N/A";

//       order.detailsOfProduct.forEach((item) => {
//         // --- UPDATED: Access the color name from the nested object ---
//         worksheet.addRow({
//           tokenNumber: row++,
//           orderNumber: order.orderNumber,
//           customerName: order.detailsOfCustomer?.name || "N/A",
//           customerEmail: order.detailsOfCustomer?.email || "N/A",
//           customerPhone: order.detailsOfCustomer?.phoneNumber || "N/A",
//           customerAddress: customerAddress,
//           productName: item.productId?.name || "Unknown Product",
//           size: item.size,
//           color: item.color?.name || "N/A", // Access the 'name' property
//           variety: item.variety,
//           quantity: item.quantity,
//           amount: order.amount,
//           date: new Date(order.createdAt)
//             .toLocaleDateString("en-GB", {
//               year: "numeric",
//               month: "2-digit",
//               day: "2-digit",
//             })
//             .replace(/\//g, "-"),
//           razorpayId: order.razorpayId,
//         });
//       });
//     });

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=" + "orders.xlsx"
//     );

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error("Error exporting orders:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// import ExcelJS from "exceljs";
// import Order from "../models/order.model.js"; // Make sure Order model is imported

export const exportOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    // Date filtering logic remains the same
    if (startDate) {
      query.createdAt = { ...query.createdAt, $gte: new Date(startDate) };
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { ...query.createdAt, $lte: endOfDay };
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      // UPDATED: Changed "detailsOfCustomer" to "customer" and populate the address
      .populate("customer", "name email phoneNumber address");
    // REMOVED: No longer need to populate product details

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    // UPDATED: Columns adjusted for the new schema
    worksheet.columns = [
      { header: "Row #", key: "rowNumber", width: 10 },
      { header: "Order #", key: "orderNumber", width: 20 },
      { header: "Customer Name", key: "customerName", width: 30 },
      { header: "Customer Email", key: "customerEmail", width: 40 },
      { header: "Customer Phone", key: "customerPhone", width: 20 },
      { header: "Customer Address", key: "customerAddress", width: 50 },
      { header: "Product Name", key: "productName", width: 40 },
      { header: "Variant", key: "variantName", width: 15 },
      { header: "Size", key: "size", width: 10 },
      { header: "Color", key: "colorName", width: 15 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Price Per Item", key: "price", width: 15 },
      { header: "Order Total", key: "totalAmount", width: 15 },
      { header: "Date", key: "date", width: 20 },
      { header: "Payment ID", key: "razorpayId", width: 30 },
    ];

    let rowNum = 1;
    orders.forEach((order) => {
      // UPDATED: Logic to get address from populated customer
      const customerAddress = order.customer?.address
        ? Object.values(order.customer.address).filter(Boolean).join(", ")
        : "N/A";

      // UPDATED: Loop over 'items' instead of 'detailsOfProduct'
      order.items.forEach((item) => {
        // UPDATED: Add row using snapshot data from 'item' and new field names
        worksheet.addRow({
          rowNumber: rowNum++,
          orderNumber: order.orderNumber,
          customerName: order.customer?.name || "N/A",
          customerEmail: order.customer?.email || "N/A",
          customerPhone: order.customer?.phoneNumber || "N/A",
          customerAddress: customerAddress,
          productName: item.productName, // From snapshot
          variantName: item.variantName, // From snapshot
          size: item.size, // From snapshot
          colorName: item.colorName, // From snapshot
          quantity: item.quantity,
          price: item.price, // From snapshot
          totalAmount: order.totalAmount,
          date: new Date(order.createdAt).toLocaleDateString("en-GB"),
          razorpayId: order.razorpayId,
        });
      });
    });

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
