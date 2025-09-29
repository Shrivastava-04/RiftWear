export const adminOnly = (req, res, next) => {
  // This middleware should run *after* the protectRoute middleware
  if (req.user && req.user.role === "admin") {
    next(); // User is an admin, proceed to the next function (the controller)
  } else {
    res.status(403).json({ message: "Forbidden. Admin access required." });
  }
};
