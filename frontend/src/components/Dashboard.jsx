import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import GrievanceForm from './GrievanceForm';
import GrievanceList from './GrievanceList';
import { FiSearch, FiPlus } from 'react-icons/fi';

const Dashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGrievance, setEditingGrievance] = useState(null);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/grievances`);
      setGrievances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchGrievances();
      return;
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/grievances/search?title=${searchQuery}`);
      setGrievances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteGrievance = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/grievances/${id}`);
      setGrievances(grievances.filter(g => g._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (grievance) => {
    setEditingGrievance(grievance);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingGrievance(null);
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>My Grievances</h1>
          <div className="dashboard-actions">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-secondary">Search</button>
            </form>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <FiPlus /> New Grievance
            </button>
          </div>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <GrievanceForm 
                onClose={closeForm} 
                refreshGrievances={fetchGrievances} 
                editingGrievance={editingGrievance}
              />
            </div>
          </div>
        )}

        <GrievanceList 
          grievances={grievances} 
          onDelete={deleteGrievance} 
          onEdit={handleEdit} 
        />
      </main>
    </div>
  );
};

export default Dashboard;
