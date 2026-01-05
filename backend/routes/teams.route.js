import express from "express";
import {
  addTeam,
  deleteTeamByID,
  deleteTeams,
  editTeam,
  getTeam,
  getTeamsByID,
} from "../controller/teams.controller.js";

const router = express.Router();

// Creating Team

router.post("/add", addTeam);

// View Team

router.get("/view", getTeam);

// View Team By ID

router.get("/view/:id", getTeamsByID);

// Update Team

router.patch("/edit/:id", editTeam);

// Delete Team By ID

router.delete("/delete/:id", deleteTeamByID);

// Delete Teams

router.delete("/delete", deleteTeams);

export default router;
