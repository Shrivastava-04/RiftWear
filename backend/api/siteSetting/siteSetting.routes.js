import express from "express";
import { getSettings, updateSettings } from "./siteSetting.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/admin.middleware.js";

const router = express.Router();

router.get("/public", getSettings);

// All routes in this file are protected and for admins only.
router.use(protectRoute, adminOnly);

// GET the single settings document
router.get("/", getSettings);

// PUT (update) the single settings document
router.put("/", updateSettings);

export default router;
