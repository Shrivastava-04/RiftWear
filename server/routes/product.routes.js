import express from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";

const router = express.Router();

// Use the product routes
router.get("/getallproduct", getAllProducts);
router.get("/productbyid", getProductById);

// Export the router
export default router;
