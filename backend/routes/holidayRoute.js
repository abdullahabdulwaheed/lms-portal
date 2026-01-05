import express from "express";
import {
  addHoliday,
  getHolidays,
  editHoliday,
  deleteHoliday,
} from "../controller/holidayController.js";

import {
  protect,
  adminOrSuperAdminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= USER ================= */
router.get("/view", protect, getHolidays);

/* ================= ADMIN & SUPER ADMIN ================= */
router.post("/add", protect, adminOrSuperAdminOnly, addHoliday);
router.patch("/edit/:id", protect, adminOrSuperAdminOnly, editHoliday);
router.delete("/delete/:id", protect, adminOrSuperAdminOnly, deleteHoliday);

export default router;
