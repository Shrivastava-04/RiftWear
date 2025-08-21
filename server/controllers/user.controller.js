// import User from "../models/user.model.js";
// import bcrypt, { hash } from "bcryptjs";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";
// import Order from "../models/orders.model.js";
// import { sendEmail } from "../services/emailService.js";
// const JWT_SECRET = process.env.JWT_SECRET;

// const generateTokenAndSetCookie = (userId, res) => {
//   const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
//   res.cookie("jwtToken", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // Use secure cookies in production
//     sameSite: "None", // Prevent CSRF attacks
//     maxAge: 3600000, // 1 hour
//   });
// };

// const frontendUrl = process.env.FRONTEND_URL;

// export const signup = async (req, res) => {
//   // Renamed from signupUser to signup for consistency with frontend
//   try {
//     const { name, email, password, phoneNumber } = req.body; // phoneNumber is now optional

//     // Basic server-side validation (always replicate/enhance frontend validation)
//     if (!name || !email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Name, email, and password are required." });
//     }
//     if (password.length < 8) {
//       // Consistent with frontend
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 8 characters long." });
//     }

//     // Check for existing email first
//     const existingUserByEmail = await User.findOne({ email });
//     if (existingUserByEmail) {
//       return res
//         .status(409)
//         .json({ message: "A user with that email already exists." }); // 409 Conflict for duplicates
//     }

//     // Only check phone number uniqueness if it's provided (because it's optional and sparse)
//     // if (phoneNumber) {
//     //   // If frontend sends empty string and schema is sparse, this will be skipped
//     //   const existingUserByPhoneNumber = await User.findOne({ phoneNumber });
//     //   if (existingUserByPhoneNumber) {
//     //     return res
//     //       .status(409)
//     //       .json({ message: "A user with that phone number already exists." }); // 409 Conflict
//     //   }
//     // }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       // Store phoneNumber as null if empty, or omit if you prefer 'undefined' based on schema
//       // Since it's optional and sparse, an empty string `""` will work if you prefer storing empty strings.
//       // If you want to explicitly save as `null` if empty from frontend, use: `phoneNumber: phoneNumber || null`
//       phoneNumber: phoneNumber || null, // Ensure `null` for optional empty
//     });
//     await newUser.save();

//     // generateTokenAndSetCookie(newUser._id, res); // Generate and set token in cookies

//     const subject = "Welcome to Rift.";
//     const htmlContent = `
//   <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
//     <p>Hi ${name},</p>
//     <p>Welcome to Rift. We're thrilled to have you join our community.</p>
//     <p>Your account has been successfully created. You can now explore our collections, save your favorite items to your wishlist, and enjoy a faster, smoother checkout experience on all future orders.</p>
//     <p>You can get started by exploring our latest collection.</p>
//     <p><a href="${frontendUrl}" style="color: #e89846; text-decoration: none;">Explore Our Latest Collection</a></p>
//     <p>Connect with Rift on Instagram to stay updated on new releases, behind-the-scenes, and exclusive offers.</p>
//     <p><a href="[YOUR_INSTAGRAM_LINK_HERE]" style="color: #e89846; text-decoration: none;">Follow us on Instagram</a></p>
//     <p>Best regards,</p>
//     <p><strong>Team Rift.</strong></p>
//     <p style="font-size: 0.9em; color: #777;">
//       <a href="${frontendUrl}/contact" style="color: #777; text-decoration: none;">Contact Us</a> | <a href="${frontendUrl}/unsubscribe" style="color: #777; text-decoration: none;">Unsubscribe</a>
//     </p>
//   </div>
// `;
//     try {
//       await sendEmail(email, subject, htmlContent);
//     } catch (emailError) {
//       console.error("Failed to send welcome email:", emailError);
//     }

//     res.status(201).json({
//       message: "User registered successfully!",
//       user: {
//         _id: newUser._id, // Use _id from Mongoose document
//         name: newUser.name,
//         email: newUser.email,
//         phoneNumber: newUser.phoneNumber,
//       },
//     });
//   } catch (error) {
//     console.error("Signup error (server-side):", error); // Improved logging
//     // Specific MongoDB duplicate key error check (fallback, as findOne should catch most)
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyValue)[0];
//       const value = error.keyValue[field];
//       return res.status(409).json({
//         message: `A user with that ${field} (${value}) already exists.`,
//       });
//     }
//     res.status(500).json({ message: "Internal Server Error during signup." });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     // console.log("hello");
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and Password are required" });
//     }
//     if (password.length < 8) {
//       return res.status(400).json({
//         message: "Password must be at least 6 characters long",
//       });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Invalid Password" });
//     }
//     // generateTokenAndSetCookie(user._id, res); // Generate and set token in cookies
//     // Optionally, you can return user data without password
//     // const subject = "Welcome back";
//     // const htmlContent = `<h1>Hello ${user.name},</h1><p>You have been logged in</p>`;

//     // try {
//     //   await sendEmail(email, subject, htmlContent);
//     // } catch (emailError) {
//     //   console.error("Failed to send welcome email:", emailError);
//     // }

//     res.status(200).json({
//       message: "Login Successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//     console.log("error: " + error.message);
//   }
// };

// export const logout = (req, res) => {
//   res.clearCookie("jwtToken");
//   res.status(200).json({ message: "Logout Successful" });
// };

// export const protect = async (req, res, next) => {
//   const token = req.cookies.jwtToken;
//   // console.log("Protect Middleware Hit."); // Confirm middleware is running
//   // console.log("Token from cookie:", token); // <--- Add this!

//   if (!token) {
//     // console.log("No token found in cookie.");
//     return res.status(401).json({ message: "Not Authorized, No token" });
//   }
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET); // Use process.env.JWT_SECRET directly here
//     // console.log("Decoded Token:", decoded); // What's in the token?
//     req.userId = decoded.userId || decoded.id; // Ensure this matches what you sign in login/signup
//     // console.log("req.userId set to:", req.userId); // What userId is being set?
//     const user = await User.findById(req.userId).select("-password");
//     if (!user) {
//       console.error("Protect: User not found from token ID.");
//       res.clearCookie("jwtToken"); // Clear potentially stale cookie
//       return res
//         .status(401)
//         .json({ message: "Not authorized, user not found." });
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     // console.error("Token verification failed in protect middleware:", error); // Detailed error log
//     console.error("Protect: Token verification failed:", error);
//     res.clearCookie("jwtToken"); // Clear potentially invalid token
//     res.status(401).json({ message: "Not authorized, token failed." });
//   }
// };
// //protected route example
// export const getProfile = async (req, res) => {
//   try {
//     // console.log("GET /user/profile route hit - req.userId:", req.userId); // Add this log!
//     const user = await User.findById(req.userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found." }); // This 404 is from the controller
//     }
//     res.status(200).json({ user });
//   } catch (error) {
//     console.error("Get profile error (server-side):", error);
//     // Important: Handle Mongoose CastError for invalid IDs here
//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "Invalid user ID format." });
//     }
//     res.status(500).json({ message: "Server error fetching profile." });
//   }
// };

// export const getUserProfileUsingId = async (req, res) => {
//   try {
//     const { id } = req.query;
//     const user = await User.findOne({
//       _id: id,
//     }).populate("cartItem.productId");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({
//       message: "User profile fetched successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         role: user.role,
//         cartItem: user.cartItem,
//         address: user.address,
//       },
//     });
//   } catch (error) {
//     console.log("error: " + error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // --- UPDATED: Add to Cart (to handle variety and color) ---
// export const addToCart = async (req, res) => {
//   try {
//     const { productId, userId, size, quantity, variety, color } = req.body; // <--- NEW fields
//     if (!productId || !userId || !size || !variety || !color || !quantity) {
//       return res.status(400).json({ message: "Missing required cart fields." });
//     }
//     if (
//       !mongoose.Types.ObjectId.isValid(productId) ||
//       !mongoose.Types.ObjectId.isValid(userId)
//     ) {
//       return res.status(400).json({ message: "Invalid ID format" });
//     }
//     const user = await User.findOne({ _id: userId });
//     if (!user) {
//       return res.status(400).json({ message: "User not exist" });
//     }

//     user.cartItem.push({ productId, size, variety, color, quantity });

//     await user.save();
//     res.status(200).json({
//       message: "Item added to cart Successfully",
//       cart: user.cartItem,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // --- UPDATED: Delete from Cart (to handle variety and color) ---
// export const deleteFromCart = async (req, res) => {
//   try {
//     const { productId, userId, size, variety, color } = req.body; // <--- NEW fields
//     if (!productId || !userId || !size || !variety || !color) {
//       return res.status(400).json({ message: "Missing required cart fields." });
//     }
//     if (
//       !mongoose.Types.ObjectId.isValid(productId) ||
//       !mongoose.Types.ObjectId.isValid(userId)
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Invalid product or user id format" });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         // Use $pull with a query to match product, size, variety, AND color
//         $pull: {
//           cartItem: {
//             productId: productId,
//             size: size,
//             variety: variety,
//             color: color,
//           },
//         },
//       },
//       { new: true }
//     ).populate("cartItem.productId");

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: "Item deleted successfully",
//       cartItem: updatedUser.cartItem,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // --- UPDATED: Update Cart Details (to handle size) ---
// export const updateCartDetails = async (req, res) => {
//   try {
//     const { userId, productId, quantity, size } = req.body; // <--- Corrected field name
//     if (
//       !userId ||
//       !productId ||
//       typeof quantity !== "number" ||
//       quantity < 1 ||
//       !size
//     ) {
//       return res.status(400).json({ message: "Invalid input provided" });
//     }
//     if (
//       !mongoose.Types.ObjectId.isValid(userId) ||
//       !mongoose.Types.ObjectId.isValid(productId)
//     ) {
//       return res.status(400).json({ message: "Invalid ID format" });
//     }

//     const updatedUser = await User.findOneAndUpdate(
//       {
//         _id: userId,
//         "cartItem.productId": productId,
//         "cartItem.size": size, // <--- Correctly find the sub-document by size
//       },
//       {
//         $set: { "cartItem.$.quantity": quantity },
//       },
//       {
//         new: true,
//       }
//     ).populate("cartItem.productId");

//     if (!updatedUser) {
//       return res
//         .status(404)
//         .json({ message: "User or product in cart not found" });
//     }

//     res.status(200).json({
//       message: "Cart item quantity updated successfully",
//       cartItem: updatedUser.cartItem,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // export const addToCart = async (req, res) => {
// //   try {
// //     const { productId, userId, InputSize, initialQuantity, variety, color } =
// //       req.body;
// //     if (
// //       !productId ||
// //       !userId ||
// //       !InputSize ||
// //       !initialQuantity ||
// //       !variety ||
// //       !color
// //     ) {
// //       return res.status(400).json({ message: "No id send" });
// //     }
// //     if (
// //       !mongoose.Types.ObjectId.isValid(productId) ||
// //       !mongoose.Types.ObjectId.isValid(userId)
// //     ) {
// //       // console.log(productId, " ", userId);
// //       return res
// //         .status(400)
// //         .json({ message: "Invalid product or user id format" });
// //     }

// //     const objectIdProductId = new mongoose.Types.ObjectId(productId);
// //     const objectIdUserId = new mongoose.Types.ObjectId(userId);

// //     const user = await User.findOne({ _id: objectIdUserId }).populate(
// //       "cartItem.productId"
// //     );
// //     if (!user) {
// //       return res.status(400).json({ message: "User not exist" });
// //     }

// //     // --- FIX 1: Correct the `some` check to access the `productId` field ---
// //     if (
// //       user.cartItem.some((item) => item.productId.equals(objectIdProductId))
// //     ) {
// //       return res.status(400).json({ message: "Product already in the cart" });
// //     }

// //     // --- FIX 2: Push an object that matches the schema ---
// //     user.cartItem.push({
// //       productId: objectIdProductId,
// //       quantity: initialQuantity || 1, // You can make this dynamic if the frontend sends it
// //       size: InputSize,
// //       variety,
// //       color,
// //     });

// //     await user.save();
// //     res.status(200).json({ message: "Item added to cart Successfully" });
// //   } catch (error) {
// //     console.log(error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const deleteFromCart = async (req, res) => {
// //   try {
// //     const { productId, userId } = req.body;
// //     if (!productId || !userId) {
// //       return res.status(400).json({ message: "No id send" });
// //     }
// //     if (
// //       !mongoose.Types.ObjectId.isValid(productId) ||
// //       !mongoose.Types.ObjectId.isValid(userId)
// //     ) {
// //       return res
// //         .status(400)
// //         .json({ message: "Invalid product or user id format" });
// //     }

// //     const objectIdProductId = new mongoose.Types.ObjectId(productId);

// //     // Use findById for cleaner code
// //     const user = await User.findById(userId).populate("cartItem.productId");
// //     if (!user) {
// //       return res.status(400).json({ message: "No user exist" });
// //     }

// //     // --- FIX 1: Correct the filter logic to return the correct comparison ---
// //     const newCart = user.cartItem.filter(
// //       (item) => !item.productId.equals(objectIdProductId)
// //     );

// //     // --- FIX 2: Reassign the cart and save ---
// //     user.cartItem = newCart;
// //     await user.save();
// //     // console.log(user.cartItem);
// //     res
// //       .status(200)
// //       .json({ message: "Item deleted successfully", cartItem: user.cartItem });
// //   } catch (error) {
// //     console.log(error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // This function is now correct, but it will only work
// // once the other two functions are fixed and new cart
// // items are added properly.
// export const getCartDetails = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     if (!userId) {
//       return res.status(400).json({ message: "User Id not send" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Id not valid" });
//     }
//     const user = await User.findById(userId).populate("cartItem.productId");
//     if (!user) {
//       return res.status(400).json({ message: "User not exist" });
//     }
//     // console.log("Populated User Obje ct:", user);
//     return res.status(200).json({
//       message: "Cart fetched Successfully",
//       cart: user.cartItem,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // export const updateCartDetails = async (req, res) => {

// //   try {
// //     const { userId, productId, quantity, InputSize } = req.body;

// //     if (
// //       !userId ||
// //       !productId ||
// //       quantity < 1 ||
// //       typeof quantity !== "number" ||
// //       typeof InputSize !== "string"
// //     ) {
// //       return res.status(400).json({ message: "Invalid input parameter" });
// //     }

// //     if (
// //       !mongoose.Types.ObjectId.isValid(userId) ||
// //       !mongoose.Types.ObjectId.isValid(productId)
// //     ) {
// //       return res.status(400).json({ message: "Invalid ID format" });
// //     }

// //     const updatedUser = await User.findOneAndUpdate(
// //       {
// //         _id: userId,
// //         "cartItem.productId": productId, // This finds the document and the sub-document
// //       },
// //       {
// //         $set: { "cartItem.$.quantity": quantity }, // The '$' is the magic positional operator
// //       },
// //       {
// //         new: true, // Returns the updated document
// //       }
// //     ).populate("cartItem.productId");
// //     if (!updatedUser) {
// //       return res
// //         .status(404)
// //         .json({ message: "User or product in cart not found" });
// //     }

// //     res.status(200).json({
// //       message: "Cart item quantity updated successfully",
// //       cartItem: updatedUser.cartItem,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const getOrdersByUserId = async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     if (!mongoose.Types.ObjectId.isValid(userId)) {
// //       return res.status(400).json({ message: "Invalid user ID" });
// //     }

// //     const orders = await Order.find({ detailsOfCustomer: userId })
// //       .sort({ createdAt: -1 }) // Sort by newest first
// //       .populate("detailsOfProduct.productId", "name images price");

// //     if (!orders) {
// //       return res
// //         .status(404)
// //         .json({ message: "No orders found for this user." });
// //     }

// //     res.status(200).json({ orders });
// //   } catch (error) {
// //     console.error("Error fetching orders:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
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

// export const updateUser = async (req, res) => {
//   try {
//     const { userId, phoneNumber, address } = req.body;

//     if (!userId) {
//       console.log("object");
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).josn({ message: "Invalid user Id" });
//     }
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         phoneNumber: phoneNumber,
//         address: address,
//       },
//       {
//         new: true,
//       }
//     );

//     if (!updateUser) {
//       return res.status(404).json({ message: "Unable to update user" });
//     }
//     console.log(updatedUser);

//     res.status(200).json({
//       message: "User updated successfull",
//       user: {
//         name: updatedUser.name,
//         email: updatedUser.email,
//         phoneNumber: updatedUser.phoneNumber,
//         address: updatedUser.address,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//     console.log(error);
//   }
// };
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Order from "../models/orders.model.js";
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
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Rift</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      background-color: #0f0e0e;
      color: #e5e7eb;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #1a1a1a;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }
    .header {
      padding: 24px;
      text-align: center;
      background-color: #1a1a1a;
      border-bottom: 1px solid #2e2e2e;
    }
    .brand {
      font-size: 28px;
      font-weight: 800;
      background: linear-gradient(to right, #f7d498, #e89846);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .content {
      padding: 24px;
    }
    .content h1 {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #b0b0b0;
      margin-bottom: 16px;
    }
    .button {
      display: inline-block;
      background-color: #e89846;
      color: #0f0e0e;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      padding: 12px 24px;
      border-radius: 6px;
      text-align: center;
      margin-top: 16px;
    }
    .ps-note {
      font-size: 14px;
      font-style: italic;
      color: #e89846;
      margin-top: 20px;
      padding: 16px;
      background-color: #2e2e2e;
      border-radius: 4px;
    }
  </style>
</head>
<body>

  <div style="background-color: #0f0e0e; padding: 20px 0;">
    <table class="container" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td class="header">
          <div class="brand">Rift</div>
        </td>
      </tr>
      <tr>
        <td class="content">
          <h1>Hi ${name},</h1>
          <p>This is to confirm your account with Rift is active. We're glad to have you with us.</p>
          <p>You're all set to manage your orders and enjoy a streamlined checkout on future purchases.</p>
          <div style="text-align: center;">
            <a href="${frontendUrl}" class="button">See the current collection here</a>
          </div>
          <p style="margin-top: 20px;">Best,</p>
          <p><strong>Team Rift</strong></p>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 24px;">
          <p class="ps-note">
            P.S. To ensure you receive our order confirmation emails, please drag this message to your <strong>"Primary"</strong> inbox, if it landed in any other tab (promotion).
          </p>
        </td>
      </tr>
    </table>
  </div>

</body>
</html>`;

    try {
      console.log(htmlContent);
      await sendEmail(email, subject, htmlContent);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        _id: newUser._id,
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

// --- UPDATED: Add to Cart ---
export const addToCart = async (req, res) => {
  try {
    const { productId, userId, size, quantity, variety, color } = req.body;

    if (!productId || !userId || !size || !variety || !color || !quantity) {
      return res.status(400).json({ message: "Missing required cart fields." });
    }
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ message: "User not exist" });
    }

    // Check for existing product in cart with the same size, variety, and color
    const existingItem = user.cartItem.find(
      (item) =>
        item.productId.equals(productId) &&
        item.size === size &&
        item.variety === variety &&
        item.color.name === color.name // Compare the color name
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cartItem.push({ productId, size, variety, color, quantity });
    }

    await user.save();
    res.status(200).json({
      message: "Item added to cart Successfully",
      cart: user.cartItem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- UPDATED: Delete from Cart ---
// export const deleteFromCart = async (req, res) => {
//   try {
//     const { productId, userId, size, variety, color } = req.body;

//     if (!productId || !userId || !size || !variety || !color) {
//       return res.status(400).json({ message: "Missing required cart fields." });
//     }
//     if (
//       !mongoose.Types.ObjectId.isValid(productId) ||
//       !mongoose.Types.ObjectId.isValid(userId)
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Invalid product or user id format" });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         $pull: {
//           cartItem: {
//             productId: productId,
//             size: size,
//             variety: variety,
//             "color.name": color.name, // Match by the color name
//           },
//         },
//       },
//       { new: true }
//     ).populate("cartItem.productId");

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: "Item deleted successfully",
//       cartItem: updatedUser.cartItem,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// --- UPDATED: Update Cart Details ---
// export const updateCartDetails = async (req, res) => {
//   try {
//     const { userId, productId, quantity, size, variety, color } = req.body;

//     if (
//       !userId ||
//       !productId ||
//       typeof quantity !== "number" ||
//       quantity < 1 ||
//       !size ||
//       !variety ||
//       !color
//     ) {
//       return res.status(400).json({ message: "Invalid input provided" });
//     }
//     if (
//       !mongoose.Types.ObjectId.isValid(userId) ||
//       !mongoose.Types.ObjectId.isValid(productId)
//     ) {
//       return res.status(400).json({ message: "Invalid ID format" });
//     }

//     const updatedUser = await User.findOneAndUpdate(
//       {
//         _id: userId,
//         "cartItem.productId": productId,
//         "cartItem.size": size,
//         "cartItem.variety": variety,
//         "cartItem.color.name": color.name, // Find item by color name
//       },
//       {
//         $set: { "cartItem.$.quantity": quantity },
//       },
//       {
//         new: true,
//       }
//     ).populate("cartItem.productId");

//     if (!updatedUser) {
//       return res
//         .status(404)
//         .json({ message: "User or product in cart not found" });
//     }

//     res.status(200).json({
//       message: "Cart item quantity updated successfully",
//       cartItem: updatedUser.cartItem,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// server/controllers/user.controller.js

export const updateCartDetails = async (req, res) => {
  try {
    const { userId, cartItemId, quantity } = req.body;

    if (
      !userId ||
      !cartItemId ||
      typeof quantity !== "number" ||
      quantity < 1
    ) {
      return res.status(400).json({ message: "Invalid input provided." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(cartItemId)
    ) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    // Find the user and update the specific cart item by its subdocument _id
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        "cartItem._id": cartItemId, // <-- Match by the subdocument's unique _id
      },
      {
        $set: { "cartItem.$.quantity": quantity }, // <-- Use positional operator to update the matched item
      },
      {
        new: true, // Return the modified document
      }
    ).populate("cartItem.productId");

    if (!updatedUser) {
      return res.status(404).json({ message: "User or cart item not found." });
    }

    res.status(200).json({
      message: "Cart item quantity updated successfully.",
      cartItem: updatedUser.cartItem, // Return the full updated cart
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Also update deleteFromCart to use the same logic
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

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const orders = await Order.find({ detailsOfCustomer: userId })
      .sort({ createdAt: -1 })
      .populate("detailsOfProduct.productId", "name images price");

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user.", orderLength: 0 });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
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
