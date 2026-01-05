import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { adminUsersData } from "../model/adminModel.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await adminUsersData.findOne({ email });
  if (!admin) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: admin._id,
      role: admin.role,
    },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token,
    role: admin.role,
  });
};
