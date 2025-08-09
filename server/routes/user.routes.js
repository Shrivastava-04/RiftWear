import express from "express";
import jwt from "jsonwebtoken"; // <--- ADD THIS
import User from "../models/user.model.js"; // <--- ADD THIS
// import { JWT_SECRET } from "../controllers/user.controller.js"; // <--- If JWT_SECRET is not globally defined or imported

import {
  addToCart,
  deleteFromCart,
  getCartDetails,
  getOrdersByUserId,
  getProfile,
  getUserProfileUsingId,
  login,
  logout,
  protect,
  signup,
  updateCartDetails,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/userById", getUserProfileUsingId);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);
router.post("/addToCart", addToCart);
router.post("/deleteFromCart", deleteFromCart);
router.get("/getCartDetails", getCartDetails);
router.put("/updateCartDetails", updateCartDetails);
router.get("/order", getOrdersByUserId); // NEW ROUTE
router.put("/updateUser", updateUser);

export default router;
