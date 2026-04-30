import React from 'react';
import { FiEdit2, FiTrash2, FiClock, FiCheckCircle } from 'react-icons/fi';

const GrievanceList = ({ grievances, onDelete, onEdit }) => {
  if (grievances.length === 0) {
    return (
      <div className="empty-state">
        <p>No grievances found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="grievance-grid">
      {grievances.map((grievance) => (
        <div key={grievance._id} className="grievance-card">
          <div className="grievance-card-header">
            <span className={`category-badge category-${grievance.category.toLowerCase()}`}>
              {grievance.category}
            </span>
            <span className={`status-badge status-${grievance.status.toLowerCase()}`}>
              {grievance.status === 'Resolved' ? <FiCheckCircle /> : <FiClock />}
              {grievance.status}
            </span>
          </div>
          <h3 className="grievance-title">{grievance.title}</h3>
          <p className="grievance-desc">{grievance.description}</p>
          <div className="grievance-card-footer">
            <span className="date">
              {new Date(grievance.date).toLocaleDateString()}
            </span>
            <div className="action-buttons">
              <button 
                className="btn-icon edit" 
                onClick={() => onEdit(grievance)}
                title="Edit"
              >
                <FiEdit2 />
              </button>
              <button 
                className="btn-icon delete" 
                onClick={() => onDelete(grievance._id)}
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GrievanceList;
