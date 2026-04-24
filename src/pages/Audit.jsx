import React, { useState, useEffect } from 'react';
import dataService from '../services/dataService';

const Audit = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [adminFilter, setAdminFilter] = useState('all');
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load audit logs using data service
  const loadAuditLogs = () => {
    setLoading(true);
    setError(null);
    
    try {
      const logs = dataService.getAuditLogs();
      console.log('Loading audit logs from data service:', logs.length);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Error loading audit logs:', err);
      setError('Failed to load audit logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Setup data service subscription and initial load
  useEffect(() => {
    loadAuditLogs();
    
    // Subscribe to data changes for live updates
    const unsubscribe = dataService.subscribe((changeType, data, cache) => {
      console.log('Audit logs received data change:', changeType);
      if (changeType === 'audit_log_added') {
        loadAuditLogs();
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Get unique admin names for filter
  const getUniqueAdmins = () => {
    const admins = [...new Set(auditLogs.map(log => log.userName))];
    return admins.sort();
  };

  // Get unique action types for filter
  const getUniqueActions = () => {
    const actions = [...new Set(auditLogs.map(log => log.action))];
    return actions.sort();
  };

  // Calculate live statistics
  const calculateStats = () => {
    const total = auditLogs.length;
    const approvals = auditLogs.filter(log => log.action === 'APPLICATION_APPROVED').length;
    const rejections = auditLogs.filter(log => log.action === 'APPLICATION_REJECTED').length;
    const logins = auditLogs.filter(log => log.action === 'LOGIN').length;
    
    // Today's activities
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayActivities = auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= today;
    }).length;

    return {
      total,
      approvals,
      rejections,
      logins,
      todayActivities
    };
  };

  const stats = calculateStats();

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesAdmin = adminFilter === 'all' || log.userName === adminFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = logDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesAction && matchesAdmin && matchesDate;
  });

  // Sort logs by timestamp (newest first)
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  // Get action badge color and icon
  const getActionBadge = (action) => {
    const config = getActionConfig(action);
    return (
      <span className={`badge bg-${config.color} me-2`}>
        <i className={`bi ${config.icon} me-1`}></i>
        {config.label}
      </span>
    );
  };

  const getActionConfig = (action) => {
    switch (action) {
      case 'APPLICATION_APPROVED':
        return { color: 'success', icon: 'bi-check-circle', label: 'Approved' };
      case 'APPLICATION_REJECTED':
        return { color: 'danger', icon: 'bi-x-circle', label: 'Rejected' };
      case 'LOGIN':
        return { color: 'info', icon: 'bi-box-arrow-in-right', label: 'Login' };
      case 'PROJECT_CREATED':
        return { color: 'primary', icon: 'bi-plus-circle', label: 'Project Created' };
      case 'USER_VERIFIED':
        return { color: 'warning', icon: 'bi-person-check', label: 'User Verified' };
      default:
        return { color: 'secondary', icon: 'bi-circle', label: action.replace('_', ' ') };
    }
  };

  // Format date and time
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US');
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      const headers = [
        'Admin Name',
        'Action',
        'Target Type',
        'Target ID',
        'Date & Time',
        'Details',
        'IP Address'
      ];

      const csvContent = [
        headers.join(','),
        ...sortedLogs.map(log => [
          `"${log.userName || 'N/A'}"`,
          `"${log.action || 'N/A'}"`,
          `"${log.targetType || 'N/A'}"`,
          `"${log.targetId || 'N/A'}"`,
          `"${new Date(log.timestamp).toLocaleString()}"`,
          `"${log.details || 'N/A'}"`,
          `"${log.ipAddress || 'N/A'}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('CSV export completed successfully');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  // Export to PDF (simplified - would need a PDF library for full implementation)
  const exportToPDF = () => {
    alert('PDF export requires additional library installation. CSV export is available.');
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4><i className="bi bi-exclamation-triangle me-2"></i>Error Loading Audit Logs</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadAuditLogs}>
            <i className="bi bi-arrow-clockwise me-2"></i>Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-shield-check text-primary me-2"></i>
            Audit Logs
          </h2>
          <p className="text-muted mb-0">
            Government Housing Management System - Activity Tracking
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={exportToCSV}>
            <i className="bi bi-file-earmark-excel me-2"></i>
            Export CSV
          </button>
          <button className="btn btn-danger" onClick={exportToPDF}>
            <i className="bi bi-file-earmark-pdf me-2"></i>
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
                <i className="bi bi-clock-history text-primary fs-4"></i>
              </div>
              <h4 className="mb-1 fw-bold">{stats.total}</h4>
              <small className="text-muted">Total Activities</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
                <i className="bi bi-check-circle text-success fs-4"></i>
              </div>
              <h4 className="mb-1 fw-bold">{stats.approvals}</h4>
              <small className="text-muted">Approvals</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
                <i className="bi bi-x-circle text-danger fs-4"></i>
              </div>
              <h4 className="mb-1 fw-bold">{stats.rejections}</h4>
              <small className="text-muted">Rejections</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
                <i className="bi bi-box-arrow-in-right text-info fs-4"></i>
              </div>
              <h4 className="mb-1 fw-bold">{stats.logins}</h4>
              <small className="text-muted">Logins</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
                <i className="bi bi-calendar-day text-warning fs-4"></i>
              </div>
              <h4 className="mb-1 fw-bold">{stats.todayActivities}</h4>
              <small className="text-muted">Today's Activities</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-secondary bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
                <i className="bi bi-database text-secondary fs-4"></i>
              </div>
              <h4 className="mb-1 fw-bold">
                {getUniqueAdmins().length}
              </h4>
              <small className="text-muted">Active Admins</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">
            <i className="bi bi-funnel text-primary me-2"></i>
            Filters
          </h5>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                <i className="bi bi-search me-2"></i>
                Search Activities
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by admin, action, target..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                <i className="bi bi-gear me-2"></i>
                Action Type
              </label>
              <select
                className="form-select"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="all">All Actions</option>
                {getUniqueActions().map(action => (
                  <option key={action} value={action}>
                    {action.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                <i className="bi bi-person me-2"></i>
                Admin Name
              </label>
              <select
                className="form-select"
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
              >
                <option value="all">All Admins</option>
                {getUniqueAdmins().map(admin => (
                  <option key={admin} value={admin}>
                    {admin}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                <i className="bi bi-calendar me-2"></i>
                Date Range
              </label>
              <select
                className="form-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
          <div className="mt-3 text-muted">
            <small>
              <i className="bi bi-info-circle me-1"></i>
              Showing {sortedLogs.length} of {auditLogs.length} activities
            </small>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">
            <i className="bi bi-clock-history text-primary me-2"></i>
            Activity Log ({sortedLogs.length} records)
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>
                    <i className="bi bi-person me-1"></i>
                    Admin Name
                  </th>
                  <th>
                    <i className="bi bi-gear me-1"></i>
                    Action
                  </th>
                  <th>
                    <i className="bi bi-tag me-1"></i>
                    Target Type
                  </th>
                  <th>
                    <i className="bi bi-hash me-1"></i>
                    Target ID
                  </th>
                  <th>
                    <i className="bi bi-calendar me-1"></i>
                    Date & Time
                  </th>
                  <th>
                    <i className="bi bi-info-circle me-1"></i>
                    Status
                  </th>
                  <th>
                    <i className="bi bi-globe me-1"></i>
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedLogs.map((log) => {
                  const formattedDate = formatDateTime(log.timestamp);
                  const actionConfig = getActionConfig(log.action);
                  
                  return (
                    <tr key={log.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-person-fill text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-semibold">{log.userName}</div>
                            <small className="text-muted">System Administrator</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className={`badge bg-${actionConfig.color} me-2`}>
                            <i className={`bi ${actionConfig.icon} me-1`}></i>
                            {actionConfig.label}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          <i className="bi bi-tag me-1"></i>
                          {log.targetType || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted font-monospace">
                          #{log.targetId?.toString().slice(-8) || 'N/A'}
                        </small>
                      </td>
                      <td>
                        <div>
                          <small className="text-muted">{formattedDate.date}</small>
                          <br />
                          <small className="text-muted">{formattedDate.time}</small>
                          <br />
                          <small className="text-primary fw-semibold">{formattedDate.relative}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          {log.previousStatus && (
                            <small className="text-muted d-block">
                              From: {log.previousStatus}
                            </small>
                          )}
                          {log.newStatus && (
                            <small className="text-success d-block">
                              To: {log.newStatus}
                            </small>
                          )}
                          {!log.previousStatus && !log.newStatus && (
                            <small className="text-muted">
                              {log.action === 'LOGIN' ? 'Success' : 'Completed'}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <small className="text-muted font-monospace">
                          {log.ipAddress || 'N/A'}
                        </small>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {sortedLogs.length === 0 && (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5 className="text-muted">No Activities Found</h5>
              <p className="text-muted">
                {auditLogs.length === 0 
                  ? 'No audit logs available in the system.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
              {auditLogs.length === 0 && (
                <button 
                  className="btn btn-primary" 
                  onClick={loadAuditLogs}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-bar-chart text-primary me-2"></i>
                Activity Summary
              </h5>
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="bg-success bg-opacity-10 rounded p-3">
                    <h3 className="text-success mb-1">{stats.approvals}</h3>
                    <small className="text-muted">Applications Approved</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="bg-danger bg-opacity-10 rounded p-3">
                    <h3 className="text-danger mb-1">{stats.rejections}</h3>
                    <small className="text-muted">Applications Rejected</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="bg-info bg-opacity-10 rounded p-3">
                    <h3 className="text-info mb-1">{stats.logins}</h3>
                    <small className="text-muted">System Logins</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="bg-primary bg-opacity-10 rounded p-3">
                    <h3 className="text-primary mb-1">
                      {stats.total > 0 ? Math.round((stats.approvals / stats.total) * 100) : 0}%
                    </h3>
                    <small className="text-muted">Approval Rate</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;
