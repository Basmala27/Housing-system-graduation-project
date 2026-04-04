import React, { useState } from 'react';
import { auditLogs, getActionColor, getActionIcon } from '../data/auditLogs';

const Audit = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.type === actionFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const logDate = new Date(log.date);
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
    
    return matchesSearch && matchesAction && matchesDate;
  });

  const getActionBadge = (type) => {
    const color = getActionColor(type);
    return <span className={`badge bg-${color}`}>{type.replace('_', ' ').toUpperCase()}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  return (
    <div className="audit">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Audit Logs</h2>
          <p className="text-muted mb-0">Track system activities and changes</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-clock-history text-primary" style={{ fontSize: '2rem' }}></i>
              <h4 className="mt-2 mb-1">{auditLogs.length}</h4>
              <small className="text-muted">Total Activities</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
              <h4 className="mt-2 mb-1">
                {auditLogs.filter(log => log.type === 'approval').length}
              </h4>
              <small className="text-muted">Approvals</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-x-circle text-danger" style={{ fontSize: '2rem' }}></i>
              <h4 className="mt-2 mb-1">
                {auditLogs.filter(log => log.type === 'rejection').length}
              </h4>
              <small className="text-muted">Rejections</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-plus-circle text-info" style={{ fontSize: '2rem' }}></i>
              <h4 className="mt-2 mb-1">
                {auditLogs.filter(log => log.type === 'creation').length}
              </h4>
              <small className="text-muted">Creations</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="search" className="form-label">Search Activities</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Search by admin, action, or target..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="action" className="form-label">Filter by Action</label>
              <select
                className="form-select"
                id="action"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="all">All Actions</option>
                <option value="approval">Approvals</option>
                <option value="rejection">Rejections</option>
                <option value="creation">Creations</option>
                <option value="update">Updates</option>
                <option value="deletion">Deletions</option>
                <option value="role_change">Role Changes</option>
                <option value="export">Exports</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="date" className="form-label">Filter by Date</label>
              <select
                className="form-select"
                id="date"
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
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4 pb-3">
          <h5 className="mb-0">
            <i className="bi bi-clock-history me-2 text-primary"></i>
            Activity Log ({filteredLogs.length})
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const formattedDate = formatDate(log.date);
                  return (
                    <tr key={log.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-person text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-semibold">{log.admin}</div>
                            <small className="text-muted">System Administrator</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2">{getActionIcon(log.type)}</span>
                          {log.action}
                        </div>
                      </td>
                      <td>
                        <span className="text-muted">{log.target}</span>
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
                      <td>{getActionBadge(log.type)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
              <h5 className="text-muted mt-3">No activities found</h5>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;
