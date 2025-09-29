import express from "express";
import { signup, login, logout, googleAuth } from "./auth.controller.js";

const router = express.Router();

// Route for traditional email and password signup
router.post("/signup", signup);

// Route for traditional email and password login
router.post("/login", login);

// Route for handling Google OAuth
router.post("/google", googleAuth);

// Route for logging out
router.post("/logout", logout);

export default router;
