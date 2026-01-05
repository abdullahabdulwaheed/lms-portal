import { teamsData } from "../model/teamsModel.js";

/* ================= CREATE TEAM ================= */
export const addTeam = async (req, res) => {
  try {
    const findTeam = await teamsData.findOne({
      team_name: req.body.team_name,
    });

    if (findTeam) {
      return res.status(409).json({ message: "Team name already exists" });
    }

    const team = await teamsData.create({
      team_name: req.body.team_name,
      user_id: req.body.user_id,
    });

    res.status(201).json({
      message: "Team Created Successfully",
      team,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= GET ALL TEAMS ================= */
export const getTeam = async (req, res) => {
  try {
    const teams = await teamsData.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= GET TEAM BY ID ================= */
export const getTeamsByID = async (req, res) => {
  try {
    const team = await teamsData.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.status(200).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= EDIT TEAM ================= */
export const editTeam = async (req, res) => {
  try {
    await teamsData.findByIdAndUpdate(
      req.params.id,
      {
        team_name: req.body.team_name,
        user_id: req.body.user_id,
      },
      { new: true }
    );

    res.status(200).json({ message: "Team Updated Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE TEAM BY ID ================= */
export const deleteTeamByID = async (req, res) => {
  try {
    await teamsData.findByIdAndDelete(req.params.id);
    res.json({ message: "Team Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE ALL TEAMS ================= */
export const deleteTeams = async (req, res) => {
  try {
    await teamsData.deleteMany({});
    res.json({ message: "All Teams Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= USER: VIEW ASSIGNED TEAM ================= */
export const getMyTeam = async (req, res) => {
  try {
    const team = await teamsData.findOne({ user_id: req.user._id });

    if (!team) {
      return res.status(404).json({ message: "No team assigned" });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
