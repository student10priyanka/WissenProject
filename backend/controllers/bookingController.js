const Booking = require("../models/Booking");
const Seat = require("../models/Seat");
const Employee = require("../models/Employee");
const { 
  getBatchForDate, 
  isWeekendOrHoliday, 
  isAfter3PM,
  getAvailableFloaterSeats 
} = require("../utils/dateUtils");

// Book a seat for an employee
exports.bookSeat = async (req, res) => {
  try {
    const { employeeId, bookingDate, seatId, bookingTime } = req.body;

    // Validate date and time
    if (isWeekendOrHoliday(bookingDate)) {
      return res.status(400).json({ message: "Booking not allowed on weekends/holidays" });
    }

    const employee = await Employee.findById(employeeId).populate("teamId");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { isBatch1DesignatedDay, isBatch2DesignatedDay } = getBatchForDate(bookingDate);
    const isDesignatedDay = (employee.batch === "Batch1" && isBatch1DesignatedDay) ||
                           (employee.batch === "Batch2" && isBatch2DesignatedDay);

    // If non-designated day, must book after 3 PM
    if (!isDesignatedDay && !isAfter3PM(bookingTime)) {
      return res.status(400).json({ 
        message: "Non-designated day bookings only allowed after 3 PM" 
      });
    }

    // Check seat availability (from Booking collection for this date)
    const existingBooking = await Booking.findOne({
      seatId,
      bookingDate,
      status: "active"
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Seat already booked for this date" });
    }

    // Check if employee already has a booking for this date
    const employeeBooking = await Booking.findOne({
      employeeId,
      bookingDate,
      status: "active"
    });

    if (employeeBooking) {
      return res.status(400).json({ message: "Employee already has a booking for this date" });
    }

    // Verify seat exists
    const seat = await Seat.findById(seatId);
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    // Create booking
    const booking = new Booking({
      employeeId,
      seatId,
      bookingDate,
      bookingTime,
      isDesignatedDay,
      status: "active"
    });

    await booking.save();
    
    // Update seat status to mark as booked
    await Seat.findByIdAndUpdate(seatId, {
      isBooked: true,
      bookedBy: employeeId,
      batch: employee.batch,
      date: bookingDate
    });
    
    // Populate details for response
    await booking.populate(['employeeId', 'seatId']);

    res.status(201).json({ 
      message: "Seat booked successfully", 
      booking 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available seats for a date
exports.getAvailableSeats = async (req, res) => {
  try {
    const { bookingDate, batch } = req.query;

    if (!bookingDate) {
      return res.status(400).json({ message: "Booking date is required" });
    }

    if (isWeekendOrHoliday(bookingDate)) {
      return res.status(400).json({ seats: [], message: "No bookings on weekends/holidays" });
    }

    // Get all bookings for this specific date
    const bookedSeatsOnDate = await Booking.find({
      bookingDate,
      status: "active"
    });

    const bookedSeatIds = bookedSeatsOnDate.map(b => b.seatId.toString());

    // Get all seats
    const allSeats = await Seat.find({});
    
    // Filter out booked seats for this date
    let availableSeats = allSeats.filter(s => !bookedSeatIds.includes(s._id.toString()));

    // Filter based on designated day
    const { isBatch1DesignatedDay, isBatch2DesignatedDay } = getBatchForDate(bookingDate);

    let filteredSeats = availableSeats;

    if (batch === "Batch1" && isBatch1DesignatedDay) {
      // Designated day for Batch1: can use designated seats (1-40)
      filteredSeats = availableSeats.filter(s => !s.isFloater);
    } else if (batch === "Batch2" && isBatch2DesignatedDay) {
      // Designated day for Batch2: can use designated seats (1-40)
      filteredSeats = availableSeats.filter(s => !s.isFloater);
    } else {
      // Non-designated day - only floater seats (41-50)
      filteredSeats = availableSeats.filter(s => s.isFloater);
    }

    res.status(200).json({ 
      seats: filteredSeats,
      totalAvailable: filteredSeats.length,
      isDesignatedDay: batch === "Batch1" ? isBatch1DesignatedDay : isBatch2DesignatedDay,
      bookedCount: bookedSeatsOnDate.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a booking and release seat
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Cancel booking
    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    // Reset seat status to available
    await Seat.findByIdAndUpdate(booking.seatId, {
      isBooked: false,
      bookedBy: null,
      batch: null,
      date: null
    });

    await booking.populate(['employeeId', 'seatId']);

    res.status(200).json({ 
      message: "Booking cancelled successfully", 
      booking 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for an employee
exports.getEmployeeBookings = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const bookings = await Booking.find({ 
      employeeId,
      status: "active"
    }).populate("seatId").populate("employeeId");

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const { bookingDate } = req.query;

    const totalSeats = await Seat.countDocuments();
    const bookedSeats = await Booking.countDocuments({ 
      bookingDate: bookingDate || new Date().toISOString().split('T')[0],
      status: "active"
    });
    const floaterSeats = await Seat.countDocuments({ isFloater: true });
    const designatedSeats = totalSeats - floaterSeats;

    res.status(200).json({
      totalSeats,
      bookedSeats,
      availableSeats: totalSeats - bookedSeats,
      floaterSeats,
      designatedSeats,
      occupancyRate: ((bookedSeats / designatedSeats) * 100).toFixed(2) + "%"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booked seats for a specific date
exports.getBookedSeatsForDate = async (req, res) => {
  try {
    const { bookingDate } = req.query;

    if (!bookingDate) {
      return res.status(400).json({ message: "Booking date is required" });
    }

    const bookings = await Booking.find({
      bookingDate,
      status: "active"
    }).populate("seatId");

    const bookedSeatIds = bookings.map(b => b.seatId._id.toString());

    res.status(200).json({
      bookedSeatIds,
      bookedCount: bookings.length,
      bookings: bookings.map(b => ({
        seatNumber: b.seatId.seatNumber,
        seatId: b.seatId._id,
        employeeId: b.employeeId,
        bookingTime: b.bookingTime
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
