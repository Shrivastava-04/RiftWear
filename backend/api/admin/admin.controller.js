import User from "../users/user.model.js";
import Order from "../orders/order.model.js";
import Product from "../products/product.model.js";
import mongoose from "mongoose"; // <-- Make sure mongoose is imported
import Department from "../departments/department.model.js";
import ExcelJS from "exceljs";

/**
 * @desc    Get all users with advanced filtering and sorting for the admin panel
 * @route   GET /api/v1/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const { role, startDate, endDate } = req.query;
    const matchStage = {};

    // --- THIS IS THE FIX ---
    // We only apply the role filter if it's 'user' or 'admin'.
    // We ignore it if it's 'all' or not provided.
    if (role && (role === "user" || role === "admin")) {
      matchStage.role = role;
    }

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const { sortBy = "createdAt", sortOrder = "desc" } = req.query;
    const sortStage = {};
    sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;

    const users = await User.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "customer",
          as: "orders",
        },
      },
      {
        $addFields: {
          totalOrders: { $size: "$orders" },
          totalSpent: { $sum: "$orders.pricingInfo.totalAmount" },
        },
      },
      { $unset: "orders" },
      { $sort: sortStage },
    ]);

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Admin Get All Users Error:", error);
    res.status(500).json({ message: "Server error fetching users." });
  }
};
// export const getAllUsers = async (req, res) => {
//   try {
//     // 1. Get query parameters with defaults
//     const {
//       page = 1,
//       limit = 20,
//       sortBy = "createdAt",
//       sortOrder = "desc",
//       role = "all",
//       search = "",
//     } = req.query;

//     // 2. Build the database query object
//     const query = {};

//     if (role && role !== "all") {
//       query.role = role;
//     }

//     if (search) {
//       const searchRegex = new RegExp(search, "i"); // 'i' for case-insensitive
//       query.$or = [{ name: searchRegex }, { email: searchRegex }];
//     }

//     // 3. Build the sort object
//     const sort = {};
//     sort[sortBy] = sortOrder === "asc" ? 1 : -1;

//     // 4. Execute queries: one for the total count, one for the paginated data
//     const totalUsers = await User.countDocuments(query);
//     const users = await User.find(query)
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit))
//       .lean(); // .lean() for better performance

//     // 5. Send the response with users and pagination info
//     res.status(200).json({
//       success: true,
//       users,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalUsers / limit),
//       totalUsers,
//     });
//   } catch (error) {
//     console.error("Error fetching users for admin:", error);
//     res.status(500).json({ message: "Server error fetching users." });
//   }
// };
/**
 * @desc    Get a single user by ID (for admin panel)
 * @route   GET /api/v1/admin/users/:id
 * @access  Private/Admin
 */

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("orders")
      .lean(); // Use .lean() for performance

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // --- ENHANCEMENT: Manually populate full cart details ---
    if (user.cart && user.cart.length > 0) {
      const detailedCart = await Promise.all(
        user.cart.map(async (item) => {
          const productDoc = await Product.findById(
            item.product.productId
          ).lean();
          if (!productDoc)
            return { ...item, product: { productName: "Deleted Product" } };

          const variantDoc = productDoc.variants.find((v) =>
            v._id.equals(item.product.variantId)
          );
          const colorDoc = variantDoc?.colors.find((c) =>
            c._id.equals(item.product.colorId)
          );

          return {
            ...item,
            product: {
              // Overwrite the partial product data with full details
              productId: productDoc._id,
              productName: productDoc.name,
              variantName: variantDoc?.name || "N/A",
              colorName: colorDoc?.name || "N/A",
              image: colorDoc?.images[0] || "",
            },
          };
        })
      );
      user.cart = detailedCart;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Admin Get User Error:", error);
    res.status(500).json({ message: "Server error fetching user." });
  }
};

/**
 * @desc    Get all orders (for admin panel)
 * @route   GET /api/v1/admin/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("customer", "name email") // Populates customer info
      // --- ADD THIS BLOCK TO POPULATE ITEM DETAILS ---
      .populate({
        path: "items.product.productId",
        select: "name variants", // Select the product name and its variants array
        model: "Product", // Explicitly specify the model to reference
      })
      // ---------------------------------------------
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error fetching orders." });
  }
};

/**
 * @desc    Get dashboard statistics (counts of users, products, orders)
 * @route   GET /api/v1/admin/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    // --- 1. Basic Counts ---
    const userCount = await User.countDocuments();
    const liveProductCount = await Product.countDocuments({ isActive: true });
    const totalOrderCount = await Order.countDocuments();

    // --- 2. Operational Order Counts ---
    const pendingShipments = await Order.countDocuments({
      orderStatus: { $nin: ["Delivered", "Cancelled"] },
    });
    const processingOrders = await Order.countDocuments({
      orderStatus: "Processing",
    });

    // --- 3. Revenue and Sales Aggregations ---
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$pricingInfo.totalAmount" },
          totalProductsSold: { $sum: { $sum: "$items.quantity" } },
        },
      },
    ]);

    // --- 4. Today's Revenue Aggregation ---
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // End of today

    const todayStats = await Order.aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
      {
        $group: {
          _id: null,
          revenueToday: { $sum: "$pricingInfo.totalAmount" },
        },
      },
    ]);

    // --- 5. Other Calculations ---
    const uniqueCustomers = await Order.distinct("customer");

    // --- 6. Top Selling & Recent Orders ---

    const topSellingProducts = await Order.aggregate([
      // Stage 1: Deconstruct the items array so each item becomes a separate document.
      { $unwind: "$items" },

      // Stage 2: Group documents by the productId and calculate the total quantity sold for each.
      {
        $group: {
          _id: "$items.product.productId", // The field to group by (the actual product's ID)
          totalSold: { $sum: "$items.quantity" }, // Sum the quantities for each product
        },
      },

      // Stage 3: Sort the results to get the highest selling products on top.
      { $sort: { totalSold: -1 } },

      // Stage 4: Limit the results to the top 5.
      { $limit: 5 },

      // --- NEW STAGES TO FETCH PRODUCT DETAILS ---

      // Stage 5: "Join" with the 'products' collection to get full product details.
      {
        $lookup: {
          from: "products", // The name of the products collection
          localField: "_id", // The field from this pipeline (the grouped productId)
          foreignField: "_id", // The field in the 'products' collection to match on
          as: "productDetails", // The name for the new array field with the matched product
        },
      },

      // Stage 6: $lookup returns an array. Deconstruct it to get a single product object.
      // Add a check to ensure we don't fail if a product was deleted and the lookup returns an empty array.
      { $match: { productDetails: { $ne: [] } } },
      { $unwind: "$productDetails" },

      // Stage 7: Reshape the final output to match what the frontend component expects.
      {
        $project: {
          _id: 1, // Keep the product's original _id
          totalSold: 1, // Keep the calculated totalSold
          productName: "$productDetails.name", // Get the name from the joined document

          // --- CORRECTED & ROBUST IMAGE LOOKUP ---
          // This safely gets the first image from the first color of the first variant.
          // It includes checks to prevent errors if any of the arrays are empty.
          image: {
            $let: {
              vars: {
                firstVariant: {
                  $ifNull: [
                    { $arrayElemAt: ["$productDetails.variants", 0] },
                    {},
                  ],
                },
              },
              in: {
                $let: {
                  vars: {
                    firstColor: {
                      $ifNull: [
                        { $arrayElemAt: ["$$firstVariant.colors", 0] },
                        {},
                      ],
                    },
                  },
                  in: {
                    $ifNull: [{ $arrayElemAt: ["$$firstColor.images", 0] }, ""], // Default to empty string if not found
                  },
                },
              },
            },
          },
        },
      },
    ]);
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer", "name email");

    // --- 7. Assemble the final stats object ---
    const stats = {
      totalUsers: userCount,
      liveProducts: liveProductCount,
      totalOrders: totalOrderCount,
      pendingShipments,
      processingOrders,
      revenue: orderStats[0]?.totalRevenue || 0,
      productsSold: orderStats[0]?.totalProductsSold || 0,
      uniqueCustomers: uniqueCustomers.length,
      averageOrderValue:
        totalOrderCount > 0
          ? (orderStats[0]?.totalRevenue || 0) / totalOrderCount
          : 0,
      revenueToday: todayStats[0]?.revenueToday || 0,
    };

    res
      .status(200)
      .json({ success: true, stats, recentOrders, topSellingProducts });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error fetching dashboard stats." });
  }
};
/**
 * @desc    Delete a user
 * @route   DELETE /api/v1/admin/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Note: In a real-world app, you might want to handle what happens to their orders.
    // For now, we will just delete the user.
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting user." });
  }
};

/**
 * @desc    Admin removes an item from a specific user's cart
 * @route   DELETE /api/v1/admin/users/:userId/cart/:cartItemId
 * @access  Private/Admin
 */
export const adminRemoveCartItem = async (req, res) => {
  try {
    const { userId, cartItemId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Use Mongoose's $pull operator to remove the item from the cart array
    user.cart.pull({ _id: cartItemId });

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Cart item removed successfully." });
  } catch (error) {
    console.error("Admin Remove Cart Item Error:", error);
    res.status(500).json({ message: "Server error removing cart item." });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const {
      categoryType,
      sortBy = "sortPriority",
      sortOrder = "asc",
      isActive = "all",
    } = req.query;

    const filter = {};
    if (categoryType && categoryType !== "all") {
      filter["category.type"] = categoryType;
    }
    if (isActive !== "all") {
      filter.isActive = isActive === "true";
    }

    let sort = {};
    // --- IMPROVED SORTING LOGIC ---
    // For price, we need to add a temporary field to sort on the minimum price of a product.
    if (sortBy === "price") {
      const products = await Product.aggregate([
        { $match: filter },
        // Add a new field 'minPrice' representing the lowest price among all variants/colors
        {
          $addFields: {
            minPrice: { $min: "$variants.colors.price" },
          },
        },
        { $sort: { minPrice: sortOrder === "asc" ? 1 : -1 } },
      ]);
      return res.status(200).json({ success: true, products });
    } else {
      // For other fields, standard sorting works
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const products = await Product.find(filter).sort(sort);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ message: "Server error fetching products." });
  }
};

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

// Note: You don't need to import Product or User here, Mongoose handles it via populate

export const exportOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    // --- Date filtering logic (unchanged) ---
    if (startDate) {
      query.createdAt = { ...query.createdAt, $gte: new Date(startDate) };
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { ...query.createdAt, $lte: endOfDay };
    }

    // --- UPDATED: Data Fetching with Nested Population ---
    // 1. Populate 'customer' to get the user's email.
    // 2. Populate the 'productId' within the 'items' array to get full product details.
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("customer", "email") // Only fetch email from the User model
      .populate({
        path: "items.product.productId",
        model: "Product", // Explicitly define the model for clarity
      });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    // --- UPDATED: Expanded Columns for Maximum Detail ---
    worksheet.columns = [
      // General
      { header: "Row #", key: "rowNumber", width: 8 },
      { header: "Order #", key: "orderNumber", width: 20 },
      { header: "Order Date", key: "orderDate", width: 15 },
      { header: "Order Status", key: "orderStatus", width: 15 },
      // Customer & Shipping (from shippingInfo snapshot)
      { header: "Customer Name", key: "customerName", width: 30 },
      { header: "Customer Email", key: "customerEmail", width: 35 },
      { header: "Customer Phone", key: "customerPhone", width: 20 },
      { header: "Shipping Address", key: "shippingAddress", width: 60 },
      // Item Details
      { header: "Product Name", key: "productName", width: 40 },
      { header: "Variant", key: "variantName", width: 15 },
      { header: "Color", key: "colorName", width: 15 },
      { header: "Size", key: "size", width: 10 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Name To Print", key: "nameToPrint", width: 20 },
      { header: "Price Per Item", key: "itemPrice", width: 15 },
      // Order-level Pricing
      { header: "Items Subtotal", key: "itemsSubtotal", width: 15 },
      { header: "Shipping Price", key: "shippingPrice", width: 15 },
      { header: "Tax", key: "taxPrice", width: 15 },
      { header: "Discount", key: "discount", width: 15 },
      { header: "Order Total", key: "totalAmount", width: 15 },
      // Payment Details
      { header: "Payment Status", key: "paymentStatus", width: 15 },
      { header: "Payment Method", key: "paymentMethod", width: 15 },
      { header: "Payment ID", key: "paymentId", width: 30 },
      // Shipment Tracking
      { header: "Shipping Carrier", key: "shippingCarrier", width: 20 },
      { header: "Tracking #", key: "trackingNumber", width: 30 },
      { header: "Shipped At", key: "shippedAt", width: 15 },
    ];

    let rowNum = 1;
    orders.forEach((order) => {
      // --- Common data for all items in this order ---
      const customerName = `${order.shippingInfo?.firstName ?? ""} ${
        order.shippingInfo?.lastName ?? ""
      }`.trim();

      const shippingAddress = [
        order.shippingInfo?.street,
        order.shippingInfo?.landmark,
        order.shippingInfo?.city,
        order.shippingInfo?.state,
        order.shippingInfo?.postalCode,
        order.shippingInfo?.country,
      ]
        .filter(Boolean)
        .join(", "); // Filter out empty parts and join

      // --- Loop through each item in the order to create a separate row ---
      order.items.forEach((item) => {
        // --- Find the specific product, variant, and color details from populated data ---
        const productDoc = item.product.productId;
        let productName = "Product Not Found";
        let variantName = "N/A";
        let colorName = "N/A";
        let itemPrice = 0;

        if (productDoc) {
          productName = productDoc.name;
          const variantDoc = productDoc.variants.find((v) =>
            v._id.equals(item.product.variantId)
          );
          if (variantDoc) {
            variantName = variantDoc.name;
            const colorDoc = variantDoc.colors.find((c) =>
              c._id.equals(item.product.colorId)
            );
            if (colorDoc) {
              colorName = colorDoc.name;
              itemPrice = colorDoc.price; // Get price from the specific color variant
            }
          }
        }

        // --- Add a row to the worksheet with all the details ---
        worksheet.addRow({
          rowNumber: rowNum++,
          orderNumber: order.orderNumber,
          orderDate: new Date(order.createdAt).toLocaleDateString("en-GB"),
          orderStatus: order.orderStatus,
          customerName: customerName,
          customerEmail: order.customer?.email ?? "N/A",
          customerPhone: order.shippingInfo?.phoneNumber ?? "N/A",
          shippingAddress: shippingAddress,
          productName: productName,
          variantName: variantName,
          colorName: colorName,
          size: item.size,
          quantity: item.quantity,
          nameToPrint: item.nameToPrint ?? "N/A",
          itemPrice: itemPrice,
          itemsSubtotal: order.pricingInfo?.itemsPrice ?? 0,
          shippingPrice: order.pricingInfo?.shippingPrice ?? 0,
          taxPrice: order.pricingInfo?.taxPrice ?? 0,
          discount: order.pricingInfo?.discount ?? 0,
          totalAmount: order.pricingInfo?.totalAmount ?? 0,
          paymentStatus: order.paymentInfo?.status ?? "N/A",
          paymentMethod: order.paymentInfo?.method ?? "N/A",
          paymentId: order.paymentInfo?.razorpay?.paymentId ?? "N/A",
          shippingCarrier: order.shippingDetails?.carrier ?? "N/A",
          trackingNumber: order.shippingDetails?.trackingNumber ?? "N/A",
          shippedAt: order.shippingDetails?.shippedAt
            ? new Date(order.shippingDetails.shippedAt).toLocaleDateString(
                "en-GB"
              )
            : "N/A",
        });
      });
    });

    // --- Set response headers to trigger download ---
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
