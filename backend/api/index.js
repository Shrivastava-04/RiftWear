import express from "express";
import userRoute from "./users/user.routes.js";
import productRoute from "./products/product.routes.js";
import adminRoute from "./admin/admin.routes.js";
import authRoute from "./auth/auth.routes.js";
import paymentRoute from "./payment/payment.routes.js";
import orderRoute from "./orders/order.routes.js";
import departmentRoute from "./departments/department.routes.js";
import dropRoute from "./drops/drop.routes.js";
import siteSettingRoute from "./siteSetting/siteSetting.routes.js";

const router = express.Router();

// This central router will now manage all your feature-specific routes.
// For example, any request to /api/v1/users... will be handled by userRoute.
router.use("/users", userRoute);
router.use("/products", productRoute);
router.use("/admin", adminRoute);
router.use("/auth", authRoute);
router.use("/payment", paymentRoute);
router.use("/orders", orderRoute);
router.use("/departments", departmentRoute);
router.use("/drops", dropRoute);
router.use("/settings", siteSettingRoute);

export default router;
