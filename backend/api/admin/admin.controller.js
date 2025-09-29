import User from "../users/user.model.js";
import Order from "../orders/order.model.js";
import Product from "../products/product.model.js";
import mongoose from "mongoose"; // <-- Make sure mongoose is imported

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
      .populate({
        // <-- THIS IS THE ENHANCEMENT
        path: "cart.productId",
        model: "Product",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
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
      .populate("customer", "name email") // Get customer name and email
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
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
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$items.productName" },
          image: { $first: "$items.image" },
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
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
