import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Order from "../models/orders.model.js";
import Product from "../models/product.model.js";
import { sendEmail } from "../services/emailService.js";
const JWT_SECRET = process.env.JWT_SECRET;

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
  res.cookie("jwtToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 3600000,
  });
};

const frontendUrl = process.env.FRONTEND_URL;

export const signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res
        .status(409)
        .json({ message: "A user with that email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || null,
    });
    await newUser.save();

    const subject = `${name}, your Rift account is ready.`;
    const htmlContent = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">
    <div style="padding: 24px; text-align: center; background-color: #1a1a1a; border-bottom: 1px solid #2e2e2e;">
        <div style="font-size: 28px; font-weight: 800; color: #ffffff;">Rift</div>
    </div>
    <div style="padding: 24px;">
        <p style="font-size: 16px; color: #b0b0b0;">Hi ${name},</p>
        <p style="font-size: 16px; color: #b0b0b0;">This is to confirm your account with Rift is active. We're glad to have you with us.</p>
        <p style="font-size: 16px; color: #b0b0b0;">You're all set to manage your orders and enjoy a streamlined checkout on future purchases.</p>
        <p style="font-size: 16px; color: #b0b0b0;">You can see the current collection here:</p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${frontendUrl}" style="display: inline-block; background-color: #e89846; color: #0f0e0e; text-decoration: none; font-weight: 700; font-size: 16px; padding: 12px 24px; border-radius: 6px;">Explore Our Collection</a>
        </div>
        <p style="font-size: 16px; color: #b0b0b0;">Best,</p>
        <p style="margin: 0; font-size: 16px; color: #ffffff;"><strong>Team Rift</strong></p>
    </div>
    <div style="padding: 0 24px 24px;">
        <p style="font-size: 14px; font-style: italic; color: #e89846; margin-top: 20px; padding: 16px; background-color: #2e2e2e; border-radius: 4px;">
            P.S. To ensure you receive our order confirmation emails, please drag this message to your <strong>"Primary"</strong> inbox, if it landed in any other tab (promotion).
        </p>
    </div>
</div>`;

    try {
      console.log(htmlContent);
      await sendEmail(email, subject, htmlContent);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Signup error (server-side):", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res.status(409).json({
        message: `A user with that ${field} (${value}) already exists.`,
      });
    }
    res.status(500).json({ message: "Internal Server Error during signup." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    res.status(200).json({
      message: "Login Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("error: " + error.message);
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwtToken");
  res.status(200).json({ message: "Logout Successful" });
};

export const protect = async (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token) {
    return res.status(401).json({ message: "Not Authorized, No token" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId || decoded.id;
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      console.error("Protect: User not found from token ID.");
      res.clearCookie("jwtToken");
      return res
        .status(401)
        .json({ message: "Not authorized, user not found." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Protect: Token verification failed:", error);
    res.clearCookie("jwtToken");
    res.status(401).json({ message: "Not authorized, token failed." });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error (server-side):", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format." });
    }
    res.status(500).json({ message: "Server error fetching profile." });
  }
};

export const getUserProfileUsingId = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findOne({
      _id: id,
    }).populate("cartItem.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(user);
    res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        cartItem: user.cartItem,
        address: user.address,
      },
    });
  } catch (error) {
    console.log("error: " + error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    // UPDATED: Expect variantId and colorName instead of variety and color object
    const {
      productId,
      userId,
      variantId,
      size,
      colorName,
      quantity,
      nameToPrint,
    } = req.body;

    // UPDATED: Validation for new required fields
    if (
      !productId ||
      !userId ||
      !variantId ||
      !size ||
      !colorName ||
      !quantity
    ) {
      return res.status(400).json({ message: "Missing required cart fields." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(variantId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // NEW: Server-side validation to ensure the product variant is valid
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    const variantExists = product.variants.some((v) => v._id.equals(variantId));
    if (!variantExists) {
      return res
        .status(400)
        .json({ message: "Selected variant does not exist for this product." });
    }

    // UPDATED: Check for existing item using the new schema fields
    const existingItem = user.cartItem.find(
      (item) =>
        item.productId.equals(productId) &&
        item.variantId.equals(variantId) &&
        item.size === size &&
        item.colorName === colorName
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // UPDATED: Push the new cart item structure
      user.cartItem.push({
        productId,
        variantId,
        size,
        colorName,
        quantity,
        nameToPrint,
      });
    }

    await user.save();
    res.status(200).json({
      message: "Item added to cart successfully",
      cart: user.cartItem,
    });
  } catch (error) {
    console.log("Add to cart error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCartDetails = async (req, res) => {
  try {
    // UPDATED: Now also destructuring 'nameToPrint' from the request body
    const { userId, cartItemId, quantity, nameToPrint } = req.body;

    // Determine what fields need to be updated
    const updateFields = {};

    if (quantity !== undefined) {
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity provided." });
      }
      updateFields["cartItem.$.quantity"] = quantity;
    }

    if (nameToPrint !== undefined) {
      updateFields["cartItem.$.nameToPrint"] = nameToPrint;
    }

    // Check if at least one field is being updated
    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid update fields provided." });
    }

    // UPDATED: Add validation for ID formats
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(cartItemId)
    ) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    // Find the user and update the specific cart item
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        "cartItem._id": cartItemId,
      },
      {
        $set: updateFields, // Use the dynamically created update object
      },
      {
        new: true,
      }
    ).populate("cartItem.productId");

    if (!updatedUser) {
      return res.status(404).json({ message: "User or cart item not found." });
    }

    res.status(200).json({
      message: "Cart item updated successfully.",
      cartItem: updatedUser.cartItem,
    });
  } catch (error) {
    console.error("Error updating cart details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const { userId, cartItemId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(cartItemId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid user or cart item ID format." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { cartItem: { _id: cartItemId } }, // <-- Use the unique _id to pull the item
      },
      { new: true }
    ).populate("cartItem.productId");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Item deleted successfully.",
      cartItem: updatedUser.cartItem,
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const getOrdersByUserId = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }

//     const orders = await Order.find({ detailsOfCustomer: userId })
//       .sort({ createdAt: -1 })
//       .populate("detailsOfProduct.productId", "name images price");

//     if (!orders || orders.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No orders found for this user.", orderLength: 0 });
//     }

//     res.status(200).json({ orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    const orders = await Order.find({ customer: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching orders." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId, phoneNumber, address } = req.body;

    if (!userId) {
      console.log("object");
      return res.status(400).json({ message: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).josn({ message: "Invalid user Id" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        phoneNumber: phoneNumber,
        address: address,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Unable to update user" });
    }
    console.log(updatedUser);

    res.status(200).json({
      message: "User updated successfull",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

export const getCartDetails = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User Id not send" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Id not valid" });
    }
    const user = await User.findById(userId).populate("cartItem.productId");
    if (!user) {
      return res.status(400).json({ message: "User not exist" });
    }
    // console.log("Populated User Obje ct:", user);
    return res.status(200).json({
      message: "Cart fetched Successfully",
      cart: user.cartItem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
