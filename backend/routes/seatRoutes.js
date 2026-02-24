const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seatController");

// Get all seats
router.get("/", seatController.getAllSeats);

// Get seat by ID
router.get("/:id", seatController.getSeatById);

// Update seat
router.put("/:id", seatController.updateSeat);

module.exports = router;