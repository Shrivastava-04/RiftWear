import express from "express";
import {
  signup,
  login,
  logout,
  googleAuth,
  resetPassword,
  forgotPassword,
} from "./auth.controller.js";

const router = express.Router();

// Route for traditional email and password signup
router.post("/signup", signup);

// Route for traditional email and password login
router.post("/login", login);

// Route for handling Google OAuth
router.post("/google", googleAuth);

// Route for logging out
router.post("/logout", logout);

// Route for password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
