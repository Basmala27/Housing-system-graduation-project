import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dataService from '../services/dataService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    users: [],
    projects: [],
    applications: [],
    enrichedApplications: [],
    stats: {
      totalUsers: 0,
      totalProjects: 0,
      totalApplications: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      approvalRate: 0,
      activeProjects: 0,
      planningProjects: 0
    }
  });

  // Load dashboard data
  const loadDashboardData = () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading dashboard data...');
      
      const users = dataService.getUsers();
      const projects = dataService.getProjects();
      const applications = dataService.getEnrichedApplications();
      const stats = dataService.getApplicationStats();

      console.log('Dashboard data loaded:', {
        users: users.length,
        projects: projects.length,
        applications: applications.length,
        stats
      });

      // Calculate project stats
      const activeProjects = projects.filter(p => p.status === 'active').length;
      const planningProjects = projects.filter(p => p.status === 'planning').length;

      const dashboardInfo = {
        users,
        projects,
        applications,
        enrichedApplications: applications,
        stats: {
          ...stats,
          totalUsers: users.length,
          totalProjects: projects.length,
          activeProjects,
          planningProjects
        }
      };

      console.log('Setting dashboard data:', dashboardInfo);
      setDashboardData(dashboardInfo);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Sort applications by submission date (latest first)
  const sortedApplications = [...dashboardData.enrichedApplications].sort((a, b) => {
    const dateA = new Date(a.submittedAt || a.createdAt);
    const dateB = new Date(b.submittedAt || b.createdAt);
    return dateB - dateA;
  });

  // Get latest 5 applications
  const recentApplications = sortedApplications.slice(0, 5);

  
  
  // Setup data service subscription and initial load
  useEffect(() => {
    loadDashboardData();
    
    // Subscribe to data changes for live updates
    const unsubscribe = dataService.subscribe((changeType, data, cache) => {
      console.log('Dashboard received data change:', changeType);
      loadDashboardData();
    });
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);
    
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      case 'pending': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading dashboard with live data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4><i className="bi bi-exclamation-triangle me-2"></i>Error Loading Dashboard</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadDashboardData}>
            <i className="bi bi-arrow-clockwise me-2"></i>Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 px-3 px-lg-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
            <div className="mb-2 mb-md-0">
              <h1 className="h3 h2 mb-0">
                <i className="bi bi-speedometer2 text-primary me-2"></i>
                Admin Dashboard
              </h1>
              <div className="d-flex flex-column flex-md-row align-items-center gap-2">
                <small className="text-muted">
                  <i className="bi bi-clock me-1"></i>
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </small>
                <small className="text-success">
                  <i className="bi bi-database-fill me-1"></i>
                  Live data from data.json
                </small>
                <div className="d-flex gap-2 mt-2">
                  <button 
                    className="btn btn-outline-secondary btn-sm" 
                    onClick={loadDashboardData}
                    disabled={loading}
                    type="button"
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    {loading ? 'Refreshing...' : 'Refresh'}
                  </button>
                  <Link to="/applications/new" className="btn btn-primary btn-sm">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Application
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-people text-primary fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Users</h6>
                  <h3 className="mb-0 fw-bold">
                    {dashboardData.stats?.totalUsers || dashboardData.users?.length || 0}
                  </h3>
                  <small className="text-muted">Registered citizens</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-building text-info fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Projects</h6>
                  <h3 className="mb-0 fw-bold">
                    {dashboardData.stats?.totalProjects || dashboardData.projects?.length || 0}
                  </h3>
                  <small className="text-muted">Housing projects</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-secondary bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-file-earmark-text text-secondary fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Applications</h6>
                  <h3 className="mb-0 fw-bold">
                    {dashboardData.stats?.totalApplications || dashboardData.applications?.length || 0}
                  </h3>
                  <small className="text-muted">All applications</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-check-circle text-success fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Approved</h6>
                  <h3 className="mb-0 fw-bold">
                    {dashboardData.stats?.approvedApplications || 0}
                  </h3>
                  <small className="text-muted">Successful applications</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Statistics */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-clock text-warning fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Pending</h6>
                  <h3 className="mb-0 fw-bold">
                    {dashboardData.stats?.pendingApplications || 0}
                  </h3>
                  <small className="text-muted">Awaiting review</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-danger bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-x-circle text-danger fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Rejected</h6>
                  <h3 className="mb-0 fw-bold">
                    {dashboardData.stats?.rejectedApplications || 0}
                  </h3>
                  <small className="text-muted">Not eligible</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-graph-up text-info fs-4"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-1">Approval Rate</h6>
                  <h3 className="mb-0 fw-bold text-info">
                    {dashboardData.stats?.approvalRate || 0}%
                  </h3>
                  <small className="text-muted">Success rate</small>
                  <div className="progress mt-2" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-info" 
                      style={{ width: `${dashboardData.stats?.approvalRate || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-activity text-primary fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Processing Status</h6>
                  <h3 className="mb-0 fw-bold text-primary">
                    {(dashboardData.stats?.pendingApplications || 0) > 0 ? 'Active' : 'Clear'}
                  </h3>
                  <small className="text-muted">
                    {dashboardData.stats?.pendingApplications || 0} pending review
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Status Summary */}
      <div className="row mb-4">
        <div className="col-lg-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">
                <i className="bi bi-building text-primary me-2"></i>
                Project Status Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6">
                  <div className="bg-success bg-opacity-10 rounded p-3">
                    <h3 className="text-success mb-1">{dashboardData.stats.activeProjects}</h3>
                    <small className="text-muted">Active Projects</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-warning bg-opacity-10 rounded p-3">
                    <h3 className="text-warning mb-1">{dashboardData.stats.planningProjects}</h3>
                    <small className="text-muted">Planning Phase</small>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Project Completion</small>
                  <small className="text-muted fw-bold">
                    {dashboardData.stats.totalProjects > 0 ? 
                      Math.round((dashboardData.stats.activeProjects / dashboardData.stats.totalProjects) * 100) : 0}%
                  </small>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${dashboardData.stats.totalProjects > 0 ? 
                      (dashboardData.stats.activeProjects / dashboardData.stats.totalProjects) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="col-lg-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">
                <i className="bi bi-people text-primary me-2"></i>
                User Statistics
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6">
                  <div className="bg-primary bg-opacity-10 rounded p-3">
                    <h3 className="text-primary mb-1">{dashboardData.stats.totalUsers}</h3>
                    <small className="text-muted">Total Users</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-info bg-opacity-10 rounded p-3">
                    <h3 className="text-info mb-1">
                      {dashboardData.stats.totalUsers > 0 ? 
                        Math.round((dashboardData.stats.approvedApplications / dashboardData.stats.totalUsers) * 100) : 0}%
                    </h3>
                    <small className="text-muted">Application Rate</small>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Admin Users</small>
                  <small className="text-muted fw-bold">
                    {dashboardData.users.filter(u => u.role === 'admin').length}
                  </small>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Citizen Users</small>
                  <small className="text-muted fw-bold">
                    {dashboardData.users.filter(u => u.role === 'citizen').length}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Applications Alert */}
      {(dashboardData.stats?.pendingApplications || 0) > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
              <div className="flex-grow-1">
                <h6 className="alert-heading mb-1"> Action Required</h6>
                <p className="mb-0">
                  <strong>{dashboardData.stats?.pendingApplications || 0}</strong> application{(dashboardData.stats?.pendingApplications || 0) > 1 ? 's' : ''} need{(dashboardData.stats?.pendingApplications || 0) > 1 ? '' : 's'} review.
                  <Link to="/applications" className="alert-link ms-1">Review now</Link> to maintain efficiency.
                </p>
              </div>
              <div className="d-flex gap-2">
                <Link to="/applications?filter=pending" className="btn btn-warning btn-sm">
                  <i className="bi bi-list-check me-1"></i>
                  View Pending
                </Link>
                <Link to="/applications" className="btn btn-outline-warning btn-sm">
                  <i className="bi bi-arrow-right me-1"></i>
                  All Applications
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Applications Table */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-clock-history text-primary me-2"></i>
                Recent Applications (Latest 5)
              </h5>
              <Link to="/applications" className="btn btn-outline-primary btn-sm">
                <i className="bi bi-list me-1"></i>
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentApplications.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-inbox text-muted fs-1"></i>
                  <p className="text-muted mt-2">No applications found</p>
                  <Link to="/applications/new" className="btn btn-primary">
                    Add First Application
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Applicant Name</th>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Submitted Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map((application) => (
                        <tr key={application.id}>
                          <td>
                            <small className="text-muted font-monospace">
                              #{application.id?.toString().slice(-6) || 'N/A'}
                            </small>
                          </td>
                          <td className="fw-medium">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                                <i className="bi bi-person-fill text-primary"></i>
                              </div>
                              {application.applicantName || 'Unknown User'}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              <i className="bi bi-building me-1"></i>
                              {application.projectName || 'Unknown Project'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(application.status)}`}>
                              {application.status === 'approved' && ' Approved'}
                              {application.status === 'rejected' && ' Rejected'}
                              {application.status === 'pending' && ' Pending'}
                              {application.status || ' Unknown'}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {formatDate(application.submittedAt || application.createdAt)}
                            </small>
                          </td>
                          <td>
                            <Link 
                              to={`/review/${application.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <i className="bi bi-eye me-1"></i>
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <i className="bi bi-plus-circle text-primary fs-1 mb-3"></i>
              <h5 className="card-title">Add New Application</h5>
              <p className="card-text text-muted">Create a new housing application</p>
              <Link to="/applications/new" className="btn btn-primary">
                <i className="bi bi-plus me-1"></i>
                Create Application
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <i className="bi bi-list-check text-info fs-1 mb-3"></i>
              <h5 className="card-title">Manage Applications</h5>
              <p className="card-text text-muted">Review and process applications</p>
              <Link to="/applications" className="btn btn-info">
                <i className="bi bi-list me-1"></i>
                View All Applications
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <i className="bi bi-shield-check text-success fs-1 mb-3"></i>
              <h5 className="card-title">System Logs</h5>
              <p className="card-text text-muted">View system activity and audit logs</p>
              <Link to="/audit" className="btn btn-success">
                <i className="bi bi-journal-text me-1"></i>
                View Logs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
