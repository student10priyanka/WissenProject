const mongoose = require("mongoose");

const seatAllocationSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },
  batch: {
    type: String,
    enum: ["Batch1", "Batch2"],
    required: true
  },
  weekNumber: {
    type: Number,
    enum: [1, 2],
    required: true
  },
  allocatedSeats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SeatAllocation", seatAllocationSchema);
