const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Models
const Seat = require("./models/Seat");
const Team = require("./models/Team");
const Employee = require("./models/Employee");
const Booking = require("./models/Booking");

// Routes
const seatRoutes = require("./routes/seatRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const teamRoutes = require("./routes/teamRoutes");

app.use("/api/seats", seatRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ message: "Server is running" });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/seat-booking")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// Initialize seats on first run
mongoose.connection.once("open", async () => {
  const seatCount = await Seat.countDocuments();
  
  if (seatCount === 0) {
    const seats = [];
    for (let i = 1; i <= 50; i++) {
      seats.push({
        seatNumber: i,
        isFloater: i > 40,
        isBooked: false
      });
    }
    await Seat.insertMany(seats);
    console.log("50 Seats Created");
  } else {
    // Reset all seats to available on server startup
    await Seat.updateMany({}, { isBooked: false, bookedBy: null });
    console.log("Seats reset to available");
  }

  // Initialize sample teams if not exists
  const teamCount = await Team.countDocuments();
  if (teamCount === 0) {
    const teams = [];
    for (let i = 1; i <= 10; i++) {
      teams.push({
        name: `Squad ${i}`,
        squadNumber: i,
        memberCount: 8
      });
    }
    await Team.insertMany(teams);
    console.log("10 Teams Created");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});