import express from "express";
import { checkIn, checkOut, getAttendance } from "../controller/attendanceController.js";
import { protect, superAdminOnly, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Check-in
router.post("/checkin", protect, checkIn);

// Check-out
router.post("/checkout", protect, checkOut);

// View attendance
router.get("/view", protect, getAttendance);

export default router;
