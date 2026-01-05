import express from "express";
import {
  addTeam,
  deleteTeamByID,
  deleteTeams,
  editTeam,
  getTeam,
  getTeamsByID,
  getMyTeam,
} from "../controller/teamsController.js";

import { protect, adminOrSuperAdminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADMIN & SUPER ADMIN ================= */

// Create Team
router.post("/add", protect, adminOrSuperAdminOnly, addTeam);

// View All Teams
router.get("/view", protect, adminOrSuperAdminOnly, getTeam);

// View Team By ID
router.get("/view/:id", protect, adminOrSuperAdminOnly, getTeamsByID);

// Update Team
router.patch("/edit/:id", protect, adminOrSuperAdminOnly, editTeam);

// Delete Team By ID
router.delete("/delete/:id", protect, adminOrSuperAdminOnly, deleteTeamByID);

// Delete All Teams
router.delete("/delete", protect, adminOrSuperAdminOnly, deleteTeams);

/* ================= USERS ================= */

// User can only view their assigned team
router.get("/my-team", protect, getMyTeam);

export default router;
