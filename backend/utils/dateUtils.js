// Get batch details based on date
function getBatchForDate(date) {
  const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 1 = Monday, etc
  const weekNumber = getWeekNumber(date);

  // Batch 1: Mon-Wed Week 1, Thu-Fri Week 2
  // Batch 2: Thu-Fri Week 1, Mon-Wed Week 2

  const isBatch1DesignatedDay = (weekNumber === 1 && [1, 2, 3].includes(dayOfWeek)) ||
                                 (weekNumber === 2 && [4, 5].includes(dayOfWeek));
  
  const isBatch2DesignatedDay = (weekNumber === 1 && [4, 5].includes(dayOfWeek)) ||
                                 (weekNumber === 2 && [1, 2, 3].includes(dayOfWeek));

  return { isBatch1DesignatedDay, isBatch2DesignatedDay };
}

// Get week number (1 or 2) based on date
function getWeekNumber(date) {
  const d = new Date(date);
  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
  const w = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return ((w - 1) % 2) + 1; // Cycle between week 1 and 2
}

// Check if date is weekend or holiday
function isWeekendOrHoliday(date) {
  const dayOfWeek = new Date(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
}

// Check if time is after 3 PM
function isAfter3PM(timeString) {
  if (!timeString) return false;
  const hour = parseInt(timeString.split(":")[0]);
  return hour >= 15; // 3 PM = 15:00
}

// Get available floater seats count
async function getAvailableFloaterSeats(date, Seat) {
  const floaterSeats = await Seat.find({ isFloater: true, isBooked: false });
  return floaterSeats.length;
}

module.exports = {
  getBatchForDate,
  getWeekNumber,
  isWeekendOrHoliday,
  isAfter3PM,
  getAvailableFloaterSeats
};
