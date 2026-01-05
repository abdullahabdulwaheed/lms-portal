import jwt from "jsonwebtoken";

/* ================= AUTH CHECK ================= */
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    // decoded should contain: id, role, email
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= SUPER ADMIN ONLY ================= */
export const superAdminOnly = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res
      .status(403)
      .json({ message: "Access denied. Super Admin only." });
  }
  next();
};

/* ================= ADMIN OR SUPER ADMIN ================= */
export const adminOrSuperAdminOnly = (req, res, next) => {
  if (
    req.user.role === "admin" ||
    req.user.role === "superadmin"
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Admin or Super Admin only.",
  });
};
