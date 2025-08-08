import User from "../models/user.model.js";

export const authorizeAdmin = async (req, res, next) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: "Authentication required for admin access" });
  }
  try {
    const user = await User.findOne({ _id: res.userId }).select("role");
    if (!user || user.role != "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in admin authorization middleware", error);
    res.status(500).json({ message: "Server Error during Authorization" });
  }
};
