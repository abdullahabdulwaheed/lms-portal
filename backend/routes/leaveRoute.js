import express from "express";
import {
  applyLeave,
  getMyLeaves,
  processLeave,
  approveRejectLeave,
  getAllLeaves,
} from "../controller/leaveController.js";

import {
  protect,
  adminOnly,
  superAdminOnly,
  adminOrSuperAdminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= USER ================= */
router.post("/apply", protect, applyLeave);
router.get("/my-leaves", protect, getMyLeaves);

/* ================= ADMIN ================= */
router.patch(
  "/process/:id",
  protect,
  adminOnly,
  processLeave
);

/* ================= SUPER ADMIN ================= */
router.patch(
  "/approve/:id",
  protect,
  superAdminOnly,
  approveRejectLeave
);

/* ================= ADMIN & SUPER ADMIN ================= */
router.get(
  "/view",
  protect,
  adminOrSuperAdminOnly,
  getAllLeaves
);

export default router;
