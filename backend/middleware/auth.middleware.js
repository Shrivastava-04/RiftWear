import jwt from "jsonwebtoken";
import User from "../api/users/user.model.js";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
// const JWT_SECRET = "80af196f5f2e13eceb17ad4ded7aebf769ff4e66f6c04fec3ac3c0664afc0ad4"; // <-- ADD THIS LINE

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwtToken;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Not authorized, token is invalid." });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User associated with this token not found." });
    }

    req.user = user; // Attach user object to the request
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res
      .status(401)
      .json({ message: "Not authorized, token failed verification." });
  }
};
