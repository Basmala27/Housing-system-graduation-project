import React, { useState } from 'react';
import { projects } from '../data/projects';

const Projects = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    totalUnits: '',
    availableUnits: '',
    priceRange: '',
    type: 'Apartments',
    status: 'active',
    completionDate: '',
    description: ''
  });

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData(project);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      location: '',
      totalUnits: '',
      availableUnits: '',
      priceRange: '',
      type: 'Apartments',
      status: 'active',
      completionDate: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving project:', formData);
    setShowModal(false);
    alert(editingProject ? 'Project updated successfully!' : 'Project added successfully!');
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      // In a real app, this would delete from backend
      console.log('Deleting project:', projectId);
      alert('Project deleted successfully!');
    }
  };

  const getStatusBadge = (status) => {
    const badgeClass = {
      active: 'bg-success',
      completed: 'bg-primary',
      planning: 'bg-warning'
    }[status] || 'bg-secondary';

    return <span className={`badge ${badgeClass}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  return (
    <div className="projects">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Projects Management</h2>
          <p className="text-muted mb-0">Manage housing projects and availability</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="bi bi-plus-circle me-2"></i>
          Add New Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4 pb-3">
          <h5 className="mb-0">
            <i className="bi bi-building me-2 text-primary"></i>
            Projects List ({projects.length})
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Project Name</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Units</th>
                  <th>Price Range</th>
                  <th>Status</th>
                  <th>Completion Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                          <i className="bi bi-building text-primary"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">{project.name}</div>
                          <small className="text-muted">{project.description}</small>
                        </div>
                      </div>
                    </td>
                    <td>{project.location}</td>
                    <td>{project.type}</td>
                    <td>
                      <div>
                        <span className="fw-semibold">{project.availableUnits}</span>
                        <span className="text-muted"> / {project.totalUnits}</span>
                      </div>
                      <div className="progress mt-1" style={{ height: '4px' }}>
                        <div 
                          className="progress-bar bg-info" 
                          style={{ width: `${((project.totalUnits - project.availableUnits) / project.totalUnits) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td>{project.priceRange}</td>
                    <td>{getStatusBadge(project.status)}</td>
                    <td>
                      <small className="text-muted">
                        {new Date(project.completionDate).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(project)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(project.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-building me-2"></i>
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Project Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Enter location"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Total Units</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.totalUnits}
                      onChange={(e) => setFormData({...formData, totalUnits: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Available Units</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.availableUnits}
                      onChange={(e) => setFormData({...formData, availableUnits: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="Apartments">Apartments</option>
                      <option value="Villas">Villas</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Price Range</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.priceRange}
                      onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                      placeholder="e.g., 1M - 3M EGP"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="planning">Planning</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Completion Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.completionDate}
                      onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter project description"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleSave}
                >
                  <i className="bi bi-check-lg me-2"></i>
                  {editingProject ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
