const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  squadNumber: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  memberCount: {
    type: Number,
    default: 8
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Team", teamSchema);
