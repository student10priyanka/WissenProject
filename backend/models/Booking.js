const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  seatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
    required: true
  },
  bookingDate: {
    type: String,
    required: true
  },
  isDesignatedDay: {
    type: Boolean,
    default: true
  },
  bookingTime: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ["active", "cancelled", "completed"],
    default: "active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  cancelledAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
