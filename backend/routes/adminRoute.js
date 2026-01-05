import express from "express";
import {
  addAdmin,
  adminLogin,
  deleteAdmin,
  deleteAdminByID,
  editAdmin,
  getAdmin,
  getAdminByID,
} from "../controller/adminController.js";
import { protect, superAdminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Login

router.post("/login", adminLogin);

// ✅ ONLY SUPER ADMIN CAN ADD ADMIN
router.post("/add", protect, superAdminOnly, addAdmin);
router.post("/add", protect, superAdminOnly, addAdmin);
router.patch("/edit/:id", protect, superAdminOnly, editAdmin);
router.delete("/delete/:id", protect, superAdminOnly, deleteAdminByID);
router.delete("/delete", protect, superAdminOnly, deleteAdmin);

// Super Admin can also view all admins
router.get("/view", protect, superAdminOnly, getAdmin);
router.get("/view/:id", protect, superAdminOnly, getAdminByID);

export default router;
