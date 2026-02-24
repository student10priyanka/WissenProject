import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EmployeeManager.css';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

function EmployeeManager() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    teamId: '',
    batch: 'Batch1'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchTeams();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

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
    
    if (!formData.name || !formData.email || !formData.teamId) {
      setMessage('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      if (formData._id) {
        await axios.put(`http://localhost:5000/api/employees/${formData._id}`, formData);
        setMessage('Employee updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/employees', formData);
        setMessage('Employee created successfully');
      }
      
      setFormData({ name: '', email: '', teamId: '', batch: 'Batch1' });
      setFormVisible(false);
      fetchEmployees();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        setMessage('Employee deleted successfully');
        fetchEmployees();
      } catch (error) {
        setMessage('Failed to delete employee');
      }
    }
  };

  return (
    <div className="employee-manager">
      <div className="manager-header">
        <h2>Employee Management</h2>
        <button 
          className="btn-add"
          onClick={() => setFormVisible(!formVisible)}
        >
          <FiPlus /> Add Employee
        </button>
      </div>

      {message && <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</div>}

      {formVisible && (
        <form onSubmit={handleSubmit} className="employee-form">
          <input
            type="text"
            name="name"
            placeholder="Employee Name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-control"
            required
          />
          <select
            name="teamId"
            value={formData.teamId}
            onChange={handleInputChange}
            className="form-control"
            required
          >
            <option value="">-- Select Team --</option>
            {teams.map(team => (
              <option key={team._id} value={team._id}>{team.name}</option>
            ))}
          </select>
          <select
            name="batch"
            value={formData.batch}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="Batch1">Batch 1</option>
            <option value="Batch2">Batch 2</option>
          </select>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Employee'}
          </button>
        </form>
      )}

      <div className="employees-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Team</th>
              <th>Batch</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.teamId?.name}</td>
                <td><span className={`batch ${emp.batch.toLowerCase()}`}>{emp.batch}</span></td>
                <td>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(emp._id)}
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

export default EmployeeManager;
