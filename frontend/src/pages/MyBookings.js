import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MyBookings.css';
import { FiTrash2, FiCalendar } from 'react-icons/fi';

function MyBookings() {
  const [employeeId, setEmployeeId] = useState(localStorage.getItem('employeeId') || '');
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchBookings();
      localStorage.setItem('employeeId', employeeId);
    }
  }, [employeeId]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/bookings/employee/${employeeId}`);
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setMessage('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.post(`http://localhost:5000/api/bookings/cancel/${bookingId}`);
        setMessage('Booking cancelled successfully');
        fetchBookings();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  return (
    <div className="my-bookings">
      <h1>My Bookings</h1>

      <div className="employee-selector">
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="form-control"
        >
          <option value="">-- Select Employee --</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      {message && <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</div>}

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : (
        <div className="bookings-list">
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <div key={booking._id} className="booking-item">
                <div className="booking-info">
                  <div className="info-row">
                    <FiCalendar />
                    <span><strong>Date:</strong> {booking.bookingDate}</span>
                  </div>
                  <div className="info-row">
                    <span><strong>Seat:</strong> {booking.seatId?.seatNumber}</span>
                  </div>
                  <div className="info-row">
                    <span><strong>Type:</strong> {booking.isDesignatedDay ? 'Designated Day' : 'Non-Designated Day'}</span>
                  </div>
                  <div className="info-row">
                    <span><strong>Status:</strong> <span className={`status ${booking.status}`}>{booking.status}</span></span>
                  </div>
                </div>
                <button
                  className="btn-cancel"
                  onClick={() => handleCancel(booking._id)}
                >
                  <FiTrash2 /> Cancel
                </button>
              </div>
            ))
          ) : (
            <div className="no-bookings">
              <p>No active bookings found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
