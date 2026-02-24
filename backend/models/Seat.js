const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true,
    unique: true
  },
  isFloater: {
    type: Boolean,
    default: false
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: String,
    default: null
  },
  batch: {
    type: String,
    default: null
  },
  date: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("Seat", seatSchema);