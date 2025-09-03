import express from "express";
import {
  setDropEndDate,
  getDropDate,
  setDropStartDate,
} from "../controllers/drop.controller.js";

const router = express.Router();

// Admin route to set the drop date (unprotected for now)
router.put("/admin/drop-end-date", setDropEndDate);
router.put("/admin/drop-start-date", setDropStartDate);

// Public route to get the drop date
router.get("/drop-date", getDropDate);

export default router;
