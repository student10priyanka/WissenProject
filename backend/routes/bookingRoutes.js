const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Book a seat
router.post("/book", bookingController.bookSeat);

// Get available seats for a date
router.get("/available", bookingController.getAvailableSeats);

// Get booked seats for a date
router.get("/booked", bookingController.getBookedSeatsForDate);

// Cancel booking
router.post("/cancel/:bookingId", bookingController.cancelBooking);

// Get employee bookings
router.get("/employee/:employeeId", bookingController.getEmployeeBookings);

// Get dashboard stats
router.get("/stats", bookingController.getDashboardStats);

module.exports = router;
