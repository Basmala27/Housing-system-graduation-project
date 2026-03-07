import React from 'react';
import { applicationStats } from '../data/applications';
import { projectStats } from '../data/projects';
import { auditLogs } from '../data/auditLogs';

const Dashboard = () => {
  const recentActivity = auditLogs.slice(0, 5);

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Welcome to Government Housing Management System</p>
        </div>
        <div className="text-muted">
          <small>
            <i className="bi bi-clock me-1"></i>
            Last updated: {new Date().toLocaleString()}
          </small>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Total Applications</h6>
                  <h3 className="mb-0 fw-bold">{applicationStats.total}</h3>
                </div>
                <div className="text-primary">
                  <i className="bi bi-file-earmark-text" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Pending</h6>
                  <h3 className="mb-0 fw-bold text-warning">{applicationStats.pending}</h3>
                </div>
                <div className="text-warning">
                  <i className="bi bi-clock-history" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Approved</h6>
                  <h3 className="mb-0 fw-bold text-success">{applicationStats.approved}</h3>
                </div>
                <div className="text-success">
                  <i className="bi bi-check-circle" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Rejected</h6>
                  <h3 className="mb-0 fw-bold text-danger">{applicationStats.rejected}</h3>
                </div>
                <div className="text-danger">
                  <i className="bi bi-x-circle" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Statistics Section */}
      <div className="row mb-4">
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Active Projects</h6>
                  <h3 className="mb-0 fw-bold text-info">{projectStats.active}</h3>
                  <p className="text-muted mb-0">Total: {projectStats.total}</p>
                </div>
                <div className="text-info">
                  <i className="bi bi-building" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Available Units</h6>
                  <h3 className="mb-0 fw-bold text-primary">{projectStats.availableUnits}</h3>
                  <p className="text-muted mb-0">Total: {projectStats.totalUnits}</p>
                </div>
                <div className="text-primary">
                  <i className="bi bi-house" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Approval Rate</h6>
                  <h3 className="mb-0 fw-bold text-success">
                    {((applicationStats.approved / applicationStats.total) * 100).toFixed(1)}%
                  </h3>
                  <p className="text-muted mb-0">This month</p>
                </div>
                <div className="text-success">
                  <i className="bi bi-graph-up" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Activity */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-4 pb-3">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                Recent Activity
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Admin</th>
                      <th>Action</th>
                      <th>Date</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((activity) => (
                      <tr key={activity.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                              <i className="bi bi-person text-primary"></i>
                            </div>
                            {activity.admin}
                          </div>
                        </td>
                        <td>{activity.action}</td>
                        <td>
                          <small className="text-muted">
                            {new Date(activity.date).toLocaleDateString()} {new Date(activity.date).toLocaleTimeString()}
                          </small>
                        </td>
                        <td>
                          <span className={`badge bg-${activity.type === 'approval' ? 'success' : activity.type === 'rejection' ? 'danger' : 'primary'}`}>
                            {activity.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 pt-4 pb-3">
              <h5 className="mb-0">
                <i className="bi bi-building me-2 text-primary"></i>
                Projects Overview
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Total Projects</span>
                  <span className="fw-bold">{projectStats.total}</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-primary" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Active Projects</span>
                  <span className="fw-bold text-success">{projectStats.active}</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${(projectStats.active / projectStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Available Units</span>
                  <span className="fw-bold text-info">{projectStats.availableUnits}</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-info" 
                    style={{ width: `${(projectStats.availableUnits / projectStats.totalUnits) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-4 pb-3">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2 text-primary"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-plus-circle me-2"></i>
                  New Application
                </button>
                <button className="btn btn-outline-success btn-sm">
                  <i className="bi bi-building me-2"></i>
                  Add Project
                </button>
                <button className="btn btn-outline-info btn-sm">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;