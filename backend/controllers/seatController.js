const Seat = require("../models/Seat");

// Get all seats
exports.getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.status(200).json({ seats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get seat by ID
exports.getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }
    res.status(200).json({ seat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update seat
exports.updateSeat = async (req, res) => {
  try {
    const { isBooked, bookedBy, batch } = req.body;
    const seat = await Seat.findByIdAndUpdate(
      req.params.id,
      { isBooked, bookedBy, batch },
      { new: true }
    );
    res.status(200).json({ message: "Seat updated", seat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
