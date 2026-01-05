import { teamsData } from "../model/teams.model.js";

// Create Team

export const addTeam = async (req, res) => {
  const findTeam = await teamsData.findOne({ team_name: req.body.team_name });
  if (findTeam) {
    return res.status(409).json({ message: "Team name already exists" });
  }
  try {
    const newTeam = new teamsData({
      team_name: req.body.team_name,
      user_id: req.body.user_id,
    });

    const team = await newTeam.save();
    res.status(201).json({ Success: "Team Created Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Team

export const getTeam = async (req, res) => {
  try {
    const teams = await teamsData.find();
    if (!teams) {
      return res.status(404).json({ message: "Teams not found" });
    } else {
      res.status(200).json(teams);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Team By ID

export const getTeamsByID = async (req, res) => {
  try {
    const team = await teamsData.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Teams not found" });
    } else {
      res.status(200).json(team);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit Team

export const editTeam = async (req, res) => {
  try {
    const editTeam = await teamsData.findByIdAndUpdate(
      { _id: req.params.id },
      {
        team_name: req.body.team_name,
        user_id: req.body.user_id,
      },
      {
        new: true,
      }
    );

    res.status(200).json({ Success: "Team Updated Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Team By ID

export const deleteTeamByID = async (req, res) => {
  const teamID = req.params.id;

  try {
    await teamsData.deleteOne({ _id: teamID });
    res.json({ message: "Team Deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Teams

export const deleteTeams = async (req, res) => {
  try {
    await teamsData.deleteMany({});
    res.json({ message: "Teams Deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
