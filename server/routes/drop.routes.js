import express from "express";
import { setDropDate, getDropDate } from "../controllers/drop.controller.js";

const router = express.Router();

// Admin route to set the drop date (unprotected for now)
router.put("/admin/drop-date", setDropDate);

// Public route to get the drop date
router.get("/drop-date", getDropDate);

export default router;
