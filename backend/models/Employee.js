const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
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
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Employee", employeeSchema);
