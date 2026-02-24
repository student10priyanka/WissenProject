import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SeatGrid.css';

function SeatGrid({ bookingDate }) {
  const [seats, setSeats] = useState([]);
  const [bookedSeatIds, setBookedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeatsAndBookings();
  }, [bookingDate]);

  const fetchSeatsAndBookings = async () => {
    try {
      setLoading(true);
      
      // Fetch all seats
      const seatsResponse = await axios.get('http://localhost:5000/api/seats');
      setSeats(seatsResponse.data.seats);
      
      // Fetch booked seats for this date
      const bookingsResponse = await axios.get('http://localhost:5000/api/bookings/booked', {
        params: { bookingDate }
      });
      setBookedSeatIds(bookingsResponse.data.bookedSeatIds);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading seats...</div>;

  const designatedSeats = seats.filter(s => !s.isFloater);
  const floaterSeats = seats.filter(s => s.isFloater);

  return (
    <div className="seat-grid-container">
      <h2>Office Layout</h2>
      
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat-available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat-booked"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="seat-floater"></div>
          <span>Floater Seat</span>
        </div>
      </div>

      <div className="grid-section">
        <h3>Designated Seats (1-40)</h3>
        <div className="seat-grid">
          {designatedSeats.map(seat => (
            <div
              key={seat._id}
              className={`seat ${bookedSeatIds.includes(seat._id) ? 'booked' : 'available'}`}
              title={`Seat ${seat.seatNumber}`}
            >
              {seat.seatNumber}
            </div>
          ))}
        </div>
      </div>

      <div className="grid-section">
        <h3>Floater Seats (41-50)</h3>
        <div className="seat-grid floater-grid">
          {floaterSeats.map(seat => (
            <div
              key={seat._id}
              className={`seat floater ${bookedSeatIds.includes(seat._id) ? 'booked' : 'available'}`}
              title={`Seat ${seat.seatNumber}`}
            >
              {seat.seatNumber}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SeatGrid;
