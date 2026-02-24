import React from 'react';
import '../styles/StatsCard.css';

function StatsCard({ icon, title, value, color }) {
  return (
    <div className={`stats-card stats-${color}`}>
      {icon && <div className="stats-icon">{icon}</div>}
      <div className="stats-content">
        <h3>{title}</h3>
        <p className="stats-value">{value}</p>
      </div>
    </div>
  );
}

export default StatsCard;
