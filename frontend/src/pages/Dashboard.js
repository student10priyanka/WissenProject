import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SeatGrid from '../components/SeatGrid';
import StatsCard from '../components/StatsCard';
import '../styles/Dashboard.css';
import { FiUsers, FiCheck, FiX } from 'react-icons/fi';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [bookingDate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/bookings/stats', {
        params: { bookingDate }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Seat Booking System Dashboard</h1>
        <p>Maximize office space utilization with smart seat allocation</p>
      </div>

      <div className="date-selector">
        <label htmlFor="booking-date">Select Date:</label>
        <input
          id="booking-date"
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="date-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : stats ? (
        <>
          <div className="stats-grid">
            <StatsCard
              icon={<FiUsers />}
              title="Total Seats"
              value={stats.totalSeats}
              color="blue"
            />
            <StatsCard
              icon={<FiCheck />}
              title="Booked Seats"
              value={stats.bookedSeats}
              color="green"
            />
            <StatsCard
              icon={<FiX />}
              title="Available Seats"
              value={stats.availableSeats}
              color="orange"
            />
            <StatsCard
              title="Occupancy Rate"
              value={stats.occupancyRate}
              color="purple"
            />
          </div>

          <div className="system-info">
            <div className="info-card">
              <h3>System Capacity</h3>
              <p><strong>Designated Seats:</strong> {stats.designatedSeats}</p>
              <p><strong>Floater Seats:</strong> {stats.floaterSeats}</p>
              <p><strong>Max Daily Capacity:</strong> 40 employees</p>
            </div>
            
            <div className="info-card">
              <h3>Batch Schedule</h3>
              <p><strong>Batch 1:</strong> Mon-Wed (Week 1), Thu-Fri (Week 2)</p>
              <p><strong>Batch 2:</strong> Thu-Fri (Week 1), Mon-Wed (Week 2)</p>
              <p><strong>Min Days/2 weeks:</strong> 5 days</p>
            </div>

            <div className="info-card">
              <h3>Booking Rules</h3>
              <p>✓ Designated day: Full access</p>
              <p>✓ Non-designated day: After 3 PM only</p>
              <p>✓ Floater seats available on off-days</p>
            </div>
          </div>

          <SeatGrid bookingDate={bookingDate} />
        </>
      ) : null}
    </div>
  );
}

export default Dashboard;
