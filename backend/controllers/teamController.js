const Team = require("../models/Team");

// Create team
exports.createTeam = async (req, res) => {
  try {
    const { name, squadNumber, memberCount } = req.body;

    const team = new Team({
      name,
      squadNumber,
      memberCount: memberCount || 8
    });

    await team.save();
    res.status(201).json({ message: "Team created", team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Team updated", team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Team deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
