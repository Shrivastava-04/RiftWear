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
        path: "cart.product.productId",
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
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAddress = req.body;

    // If this is the first address, force it to be the default.
    if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }
    // If the new address is set to default, unset any other default address.
    else if (newAddress.isDefault) {
      user.addresses.forEach((addr) => {
        if (addr.isDefault) {
          addr.isDefault = false;
        }
      });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Add Address Error:", error);
    res
      .status(400)
      .json({ message: "Error adding address.", error: error.message });
  }
};

// export const addAddress = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // If this is the first address, make it the default
//     if (user.addresses.length === 0) {
//       req.body.isDefault = true;
//     }

//     user.addresses.push(req.body); // Assumes body matches addressSchema
//     await user.save();
//     res.status(201).json({
//       success: true,
//       message: "Address added.",
//       addresses: user.addresses,
//     });
//   } catch (error) {
//     console.error("Add Address Error:", error);
//     res
//       .status(400)
//       .json({ message: "Error adding address.", error: error.message });
//   }
// };

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { addressId } = req.params;

    // Find the specific subdocument to check its properties before removing
    const addressToDelete = user.addresses.id(addressId);

    if (!addressToDelete) {
      return res.status(404).json({ message: "Address not found" });
    }

    const wasDefault = addressToDelete.isDefault;

    // Use Mongoose's .pull() method to stage the removal of the subdocument.
    // This is the modern and correct way to do this.
    user.addresses.pull(addressId);

    // If the deleted address was the default, and there are addresses remaining,
    // make the first remaining address the new default.
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    // Save the parent document. This will commit the .pull() operation to the database.
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Delete Address Error:", error);
    res
      .status(500)
      .json({ message: "Error deleting address.", error: error.message });
  }
};

// --- Cart Management ---

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.cart.length === 0) {
      return res.status(200).json({ success: true, cart: [] });
    }

    const detailedCart = await Promise.all(
      user.cart.map(async (item) => {
        const productDoc = await Product.findById(
          item.product.productId
        ).lean();
        if (!productDoc) return null; // Handle case where product might be deleted

        const variantDoc = productDoc.variants.find((v) =>
          v._id.equals(item.product.variantId)
        );
        if (!variantDoc) return null;

        const colorDoc = variantDoc.colors.find((c) =>
          c._id.equals(item.product.colorId)
        );
        if (!colorDoc) return null;

        // Construct the final, detailed cart item object
        return {
          _id: item._id, // The cart item's unique ID
          product: {
            productId: productDoc._id,
            productName: productDoc.name,
            variantId: variantDoc._id,
            variantName: variantDoc.name,
            colorId: colorDoc._id,
            // --- Populated Color Details ---
            colorName: colorDoc.name,
            images: colorDoc.images,
            price: colorDoc.price,
          },
          size: item.size,
          quantity: item.quantity,
          nameToPrint: item.nameToPrint,
        };
      })
    );

    const populatedCart = detailedCart.filter(Boolean);

    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, colorId, size, quantity, nameToPrint } =
      req.body;
    const userId = req.user._id;

    if (!productId || !variantId || !colorId || !size || !quantity) {
      console.log("done");
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
        item.product.productId.equals(productId) &&
        item.product.variantId.equals(variantId) &&
        item.product.colorId.equals(colorId) &&
        item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({
        product: { productId, variantId, colorId },
        size,
        quantity,
        nameToPrint,
      });
    }

    user.markModified("cart");
    await user.save();
    const detailedCart = await Promise.all(
      user.cart.map(async (item) => {
        const productDoc = await Product.findById(
          item.product.productId
        ).lean();
        if (!productDoc) return null; // Handle case where product might be deleted

        const variantDoc = productDoc.variants.find((v) =>
          v._id.equals(item.product.variantId)
        );
        if (!variantDoc) return null;

        const colorDoc = variantDoc.colors.find((c) =>
          c._id.equals(item.product.colorId)
        );
        if (!colorDoc) return null;

        // Construct the final, detailed cart item object
        return {
          _id: item._id, // The cart item's unique ID
          product: {
            productId: productDoc._id,
            productName: productDoc.name,
            variantId: variantDoc._id,
            variantName: variantDoc.name,
            colorId: colorDoc._id,
            // --- Populated Color Details ---
            colorName: colorDoc.name,
            images: colorDoc.images,
            price: colorDoc.price,
          },
          size: item.size,
          quantity: item.quantity,
          nameToPrint: item.nameToPrint,
        };
      })
    );

    const populatedCart = detailedCart.filter(Boolean);
    res.status(200).json({
      success: true,
      message: "Item added to cart.",
      cart: populatedCart,
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
    const detailedCart = await Promise.all(
      user.cart.map(async (item) => {
        const productDoc = await Product.findById(
          item.product.productId
        ).lean();
        if (!productDoc) return null; // Handle case where product might be deleted

        const variantDoc = productDoc.variants.find((v) =>
          v._id.equals(item.product.variantId)
        );
        if (!variantDoc) return null;

        const colorDoc = variantDoc.colors.find((c) =>
          c._id.equals(item.product.colorId)
        );
        if (!colorDoc) return null;

        // Construct the final, detailed cart item object
        return {
          _id: item._id, // The cart item's unique ID
          product: {
            productId: productDoc._id,
            productName: productDoc.name,
            variantId: variantDoc._id,
            variantName: variantDoc.name,
            colorId: colorDoc._id,
            // --- Populated Color Details ---
            colorName: colorDoc.name,
            images: colorDoc.images,
            price: colorDoc.price,
          },
          size: item.size,
          quantity: item.quantity,
          nameToPrint: item.nameToPrint,
        };
      })
    );

    const populatedCart = detailedCart.filter(Boolean);

    res.status(200).json({
      success: true,
      message: "Cart updated.",
      cart: populatedCart,
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
    const detailedCart = await Promise.all(
      user.cart.map(async (item) => {
        const productDoc = await Product.findById(
          item.product.productId
        ).lean();
        if (!productDoc) return null; // Handle case where product might be deleted

        const variantDoc = productDoc.variants.find((v) =>
          v._id.equals(item.product.variantId)
        );
        if (!variantDoc) return null;

        const colorDoc = variantDoc.colors.find((c) =>
          c._id.equals(item.product.colorId)
        );
        if (!colorDoc) return null;

        // Construct the final, detailed cart item object
        return {
          _id: item._id, // The cart item's unique ID
          product: {
            productId: productDoc._id,
            productName: productDoc.name,
            variantId: variantDoc._id,
            variantName: variantDoc.name,
            colorId: colorDoc._id,
            // --- Populated Color Details ---
            colorName: colorDoc.name,
            images: colorDoc.images,
            price: colorDoc.price,
          },
          size: item.size,
          quantity: item.quantity,
          nameToPrint: item.nameToPrint,
        };
      })
    );

    const populatedCart = detailedCart.filter(Boolean);

    res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      cart: populatedCart,
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
    const orders = await Order.find({ customer: req.user._id })
      .sort({
        createdAt: -1,
      })
      .lean();

    if (!orders || orders.length === 0) {
      return res.status(200).json({ success: true, orders: [] });
    }

    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const detailedItems = await Promise.all(
          order.items.map(async (item) => {
            const productDoc = await Product.findById(
              item.product.productId
            ).lean();
            if (!productDoc) {
              return {
                ...item,
                productName: "Product Not Found",
                image: "",
              };
            }
            const variantDoc = productDoc.variants.find((v) =>
              v._id.equals(item.product.variantId)
            );
            const colorDoc = variantDoc?.colors.find((c) =>
              c._id.equals(item.product.colorId)
            );
            return {
              ...item,
              productName: productDoc.name,
              image: colorDoc?.images[0] || "",
            };
          })
        );
        return { ...order, items: detailedItems };
      })
    );

    res.status(200).json({ success: true, orders: detailedOrders });
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

    console.log("Checking review eligibility for user:", userId);
    console.log("Product ID:", productId);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log("Invalid product ID format.");
      return res.status(400).json({ message: "Invalid product ID." });
    }

    // Find a delivered order using YOUR schema's field names
    const order = await Order.findOne({
      customer: userId,
      orderStatus: "Delivered",
      "items.product.productId": productId,
    });

    console.log(order);

    // if (!order) {
    //   return res
    //     .status(200)
    //     .json({ canReview: false, reason: "not_purchased" });
    // }

    // If purchased, check if they have already reviewed it
    const existingReview = await Product.findOne({
      _id: productId,
      "reviews.user": userId,
    });

    if (existingReview) {
      console.log(existingReview);
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
