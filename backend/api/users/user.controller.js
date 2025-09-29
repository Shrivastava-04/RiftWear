import User from "./user.model.js";
import Product from "../products/product.model.js";
import Order from "../orders/order.model.js";
import mongoose from "mongoose";

// --- Profile Management ---

export const getUserProfile = async (req, res) => {
  try {
    // req.user is attached by the protectRoute middleware, so we use req.user._id
    const user = await User.findById(req.user._id)
      .select("-password -__v ") // Clean up the response
      .populate({
        path: "cart.productId",
        model: "Product",
        select: "name images price", // Populate with only necessary product fields
      })
      .populate("wishlist", "name images price"); // Populate wishlist

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error fetching profile." });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error updating profile." });
  }
};

// --- Address Management ---

export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If this is the first address, make it the default
    if (user.addresses.length === 0) {
      req.body.isDefault = true;
    }

    user.addresses.push(req.body); // Assumes body matches addressSchema
    await user.save();
    res.status(201).json({
      success: true,
      message: "Address added.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Add Address Error:", error);
    res
      .status(400)
      .json({ message: "Error adding address.", error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid address ID." });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.pull({ _id: addressId });
    await user.save();
    res.status(200).json({
      success: true,
      message: "Address deleted.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Delete Address Error:", error);
    res.status(500).json({ message: "Error deleting address." });
  }
};

// --- Cart Management ---

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "cart.productId",
        model: "Product",
      })
      .select("cart"); // Only send back the cart array

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, size, colorName, quantity, nameToPrint } =
      req.body;
    const userId = req.user._id;

    if (!productId || !variantId || !size || !colorName || !quantity) {
      return res.status(400).json({ message: "Missing required cart fields." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found." });

    const variantExists = product.variants.some((v) => v._id.equals(variantId));
    if (!variantExists)
      return res
        .status(400)
        .json({ message: "Selected variant does not exist." });

    const existingItem = user.cart.find(
      (item) =>
        item.productId.equals(productId) &&
        item.variantId.equals(variantId) &&
        item.size === size &&
        item.colorName === colorName
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({
        productId,
        variantId,
        size,
        colorName,
        quantity,
        nameToPrint,
      });
    }

    await user.save();
    const populatedUser = await user.populate({
      path: "cart.productId",
      model: "Product",
      select: "name images price",
    });

    res.status(200).json({
      success: true,
      message: "Item added to cart.",
      cart: populatedUser.cart,
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { cartItemId, quantity, nameToPrint } = req.body;
    const userId = req.user._id;

    if (!cartItemId) {
      return res.status(400).json({ message: "Cart item ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const cartItem = user.cart.id(cartItemId);
    if (!cartItem)
      return res.status(404).json({ message: "Cart item not found." });

    if (quantity !== undefined) {
      if (quantity < 1)
        return res
          .status(400)
          .json({ message: "Quantity cannot be less than 1." });
      cartItem.quantity = quantity;
    }

    if (nameToPrint !== undefined) {
      cartItem.nameToPrint = nameToPrint;
    }

    await user.save();
    const populatedUser = await user.populate({
      path: "cart.productId",
      model: "Product",
      select: "name images price",
    });

    res.status(200).json({
      success: true,
      message: "Cart updated.",
      cart: populatedUser.cart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params; // Get ID from URL parameters
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.cart.pull({ _id: cartItemId }); // Use Mongoose's .pull() method

    await user.save();
    const populatedUser = await user.populate({
      path: "cart.productId",
      model: "Product",
      select: "name images price",
    });

    res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      cart: populatedUser.cart,
    });
  } catch (error) {
    console.error("Delete Cart Item Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- Wishlist Management ---

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist", "name images price")
      .select("wishlist");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ message: "Error fetching wishlist." });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { wishlist: productId },
    }); // $addToSet prevents duplicates
    res.status(200).json({ success: true, message: "Item added to wishlist." });
  } catch (error) {
    console.error("Add to Wishlist Error:", error);
    res.status(500).json({ message: "Error adding to wishlist." });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params; // Get ID from URL parameters
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: productId },
    });
    res
      .status(200)
      .json({ success: true, message: "Item removed from wishlist." });
  } catch (error) {
    console.error("Remove from Wishlist Error:", error);
    res.status(500).json({ message: "Error removing from wishlist." });
  }
};

// --- Order Management ---

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ message: "Server error fetching orders." });
  }
};

/**
 * @desc    Check if the logged-in user has purchased AND not yet reviewed a specific product
 * @route   GET /api/v1/users/can-review/:productId
 * @access  Private
 */
export const canUserReviewProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Find a delivered order using YOUR schema's field names
    const order = await Order.findOne({
      customer: userId,
      orderStatus: "Delivered",
      "items.productId": productId,
    });

    if (!order) {
      return res
        .status(200)
        .json({ canReview: false, reason: "not_purchased" });
    }

    // If purchased, check if they have already reviewed it
    const existingReview = await Product.findOne({
      _id: productId,
      "reviews.user": userId,
    });

    if (existingReview) {
      return res
        .status(200)
        .json({ canReview: false, reason: "already_reviewed" });
    }

    return res.status(200).json({ canReview: true });
  } catch (error) {
    console.error("Can User Review Error:", error);
    res
      .status(500)
      .json({ message: "Server error checking review eligibility." });
  }
};
