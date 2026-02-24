import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/BookingSeat.css';

function BookingSeat() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('09:00');
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAvailableSeats();
    }
  }, [bookingDate, selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setMessage('Error loading employees');
    }
  };

  const fetchAvailableSeats = async () => {
    try {
      const employee = employees.find(e => e._id === selectedEmployee);
      const response = await axios.get('http://localhost:5000/api/bookings/available', {
        params: {
          bookingDate,
          batch: employee?.batch
        }
      });
      setAvailableSeats(response.data.seats);
    } catch (error) {
      console.error('Error fetching available seats:', error);
      setMessage('Error loading available seats');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedEmployee || !selectedSeat || !bookingDate) {
      setMessage('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/bookings/book', {
        employeeId: selectedEmployee,
        seatId: selectedSeat,
        bookingDate,
        bookingTime
      });
      
      setMessage('Booking successful! ' + response.data.message);
      setSelectedEmployee('');
      setSelectedSeat('');
      setBookingTime('09:00');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h1>Book Your Seat</h1>
        
        <form onSubmit={handleBooking} className="booking-form">
          <div className="form-group">
            <label htmlFor="employee">Select Employee:</label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="form-control"
              required
            >
              <option value="">-- Choose Employee --</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.batch}) - {emp.teamId?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Booking Date:</label>
              <input
                id="date"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time:</label>
              <input
                id="time"
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="seat">Select Seat:</label>
            <div className="seat-selector">
              {availableSeats.length > 0 ? (
                availableSeats.map(seat => (
                  <button
                    key={seat._id}
                    type="button"
                    className={`seat-btn ${selectedSeat === seat._id ? 'selected' : ''}`}
                    onClick={() => setSelectedSeat(seat._id)}
                  >
                    {seat.seatNumber}
                    {seat.isFloater && <span className="floater-badge">F</span>}
                  </button>
                ))
              ) : (
                <p className="no-seats">No seats available for this criteria</p>
              )}
            </div>
          </div>

          {message && <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>

        <div className="booking-info">
          <h3>Booking Guidelines</h3>
          <ul>
            <li>Designated Day: Book seats between 9 AM - 6 PM</li>
            <li>Non-Designated Day: Book after 3 PM using floater seats</li>
            <li>Each employee can book only one seat per day</li>
            <li>Bookings are valid only for Mon-Fri</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BookingSeat;
