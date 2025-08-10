import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/user.routes.js";
import productRoute from "./routes/product.routes.js";
import adminRoute from "./routes/admin.routes.js";
import authRoute from "./routes/auth.routes.js";
import paymentRoute from "./routes/payment.routes.js"; // Correct import name
import orderRoute from "./routes/order.routes.js";
import departmentRoute from "./routes/department.route.js"; // Importing the department route
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;
const URI = process.env.MongoDB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(express.json());
app.use(cookieParser());

try {
  mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
} catch (error) {
  console.log("Error: ", error);
}

app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/admin", adminRoute);
app.use("/auth", authRoute);
app.use("/payment", paymentRoute); // Corrected typo here from "/paymet" to "/payment"
app.use("/orders", orderRoute);
app.use("/departments", departmentRoute);

app.get("/", (req, res) => {
  res.send("Hell its working!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
