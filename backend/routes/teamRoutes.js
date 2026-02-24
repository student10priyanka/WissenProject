const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

// Create team
router.post("/", teamController.createTeam);

// Get all teams
router.get("/", teamController.getAllTeams);

// Get team by ID
router.get("/:id", teamController.getTeamById);

// Update team
router.put("/:id", teamController.updateTeam);

// Delete team
router.delete("/:id", teamController.deleteTeam);

module.exports = router;
