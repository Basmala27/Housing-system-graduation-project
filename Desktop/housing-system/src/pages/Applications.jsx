import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { applications } from '../data/applications';

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const badgeClass = {
      pending: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-danger'
    }[status] || 'bg-secondary';

    return <span className={`badge ${badgeClass}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  return (
    <div className="applications">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Applications</h2>
          <p className="text-muted mb-0">Manage and review housing applications</p>
        </div>
        <button className="btn btn-primary">
          <i className="bi bi-download me-2"></i>
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="search" className="form-label">Search Applications</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Search by name, email, or project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="status" className="form-label">Filter by Status</label>
              <select
                className="form-select"
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4 pb-3">
          <h5 className="mb-0">
            <i className="bi bi-file-earmark-text me-2 text-primary"></i>
            Application List ({filteredApplications.length})
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Project</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <span className="fw-bold">#{application.id.toString().padStart(4, '0')}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                          <i className="bi bi-person text-primary"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">{application.name}</div>
                          <small className="text-muted">{application.phone}</small>
                        </div>
                      </div>
                    </td>
                    <td>{application.email}</td>
                    <td>{application.project}</td>
                    <td>
                      <small className="text-muted">
                        {new Date(application.submissionDate).toLocaleDateString()}
                      </small>
                    </td>
                    <td>{getStatusBadge(application.status)}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <Link 
                          to={`/review/${application.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-eye me-1"></i>
                          View
                        </Link>
                        {application.status === 'pending' && (
                          <>
                            <button className="btn btn-sm btn-outline-success">
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              <h5 className="text-muted mt-3">No applications found</h5>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
