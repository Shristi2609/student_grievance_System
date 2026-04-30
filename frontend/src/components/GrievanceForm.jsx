import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';

const GrievanceForm = ({ onClose, refreshGrievances, editingGrievance }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    status: 'Pending'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingGrievance) {
      setFormData({
        title: editingGrievance.title,
        description: editingGrievance.description,
        category: editingGrievance.category,
        status: editingGrievance.status
      });
    }
  }, [editingGrievance]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGrievance) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/grievances/${editingGrievance._id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/grievances`, formData);
      }
      refreshGrievances();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h2>{editingGrievance ? 'Edit Grievance' : 'Submit New Grievance'}</h2>
        <button className="btn-close" onClick={onClose}><FiX /></button>
      </div>
      
      {error && <div className="error-alert">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            placeholder="Brief title of your grievance"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Academic">Academic</option>
            <option value="Hostel">Hostel</option>
            <option value="Transport">Transport</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            placeholder="Detailed description of the issue"
            rows="5"
          ></textarea>
        </div>
        
        {editingGrievance && (
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        )}
        
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">
            {editingGrievance ? 'Update Grievance' : 'Submit Grievance'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GrievanceForm;
