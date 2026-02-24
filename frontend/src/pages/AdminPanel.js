import React, { useState } from 'react';
import '../styles/AdminPanel.css';
import EmployeeManager from '../components/EmployeeManager';
import TeamManager from '../components/TeamManager';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </button>
        <button
          className={`tab ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          Teams
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'employees' && <EmployeeManager />}
        {activeTab === 'teams' && <TeamManager />}
      </div>
    </div>
  );
}

export default AdminPanel;
