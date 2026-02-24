import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TeamManager.css';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

function TeamManager() {
  const [teams, setTeams] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    squadNumber: '',
    memberCount: 8
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teams');
      setTeams(response.data.teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.squadNumber) {
      setMessage('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/teams', formData);
      setMessage('Team created successfully');
      setFormData({ name: '', squadNumber: '', memberCount: 8 });
      setFormVisible(false);
      fetchTeams();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await axios.delete(`http://localhost:5000/api/teams/${id}`);
        setMessage('Team deleted successfully');
        fetchTeams();
      } catch (error) {
        setMessage('Failed to delete team');
      }
    }
  };

  return (
    <div className="team-manager">
      <div className="manager-header">
        <h2>Team Management</h2>
        <button 
          className="btn-add"
          onClick={() => setFormVisible(!formVisible)}
        >
          <FiPlus /> Add Team
        </button>
      </div>

      {message && <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</div>}

      {formVisible && (
        <form onSubmit={handleSubmit} className="team-form">
          <input
            type="text"
            name="name"
            placeholder="Team Name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
          <select
            name="squadNumber"
            value={formData.squadNumber}
            onChange={handleInputChange}
            className="form-control"
            required
          >
            <option value="">-- Select Squad Number --</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>Squad {num}</option>
            ))}
          </select>
          <input
            type="number"
            name="memberCount"
            placeholder="Member Count"
            value={formData.memberCount}
            onChange={handleInputChange}
            className="form-control"
            min="1"
            max="8"
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Team'}
          </button>
        </form>
      )}

      <div className="teams-table">
        <table>
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Squad Number</th>
              <th>Member Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team._id}>
                <td>{team.name}</td>
                <td>Squad {team.squadNumber}</td>
                <td>{team.memberCount}</td>
                <td>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(team._id)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeamManager;
