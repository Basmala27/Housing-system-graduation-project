import React, { useState } from 'react';

const Roles = () => {
  const [users] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@gov.eg",
      role: "Admin",
      status: "active",
      lastLogin: "2024-01-20 14:30:00",
      department: "Housing Authority"
    },
    {
      id: 2,
      name: "Sarah Ahmed",
      email: "sarah.ahmed@gov.eg",
      role: "Reviewer",
      status: "active",
      lastLogin: "2024-01-20 10:15:00",
      department: "Application Review"
    },
    {
      id: 3,
      name: "Mohamed Hassan",
      email: "mohamed.hassan@gov.eg",
      role: "Reviewer",
      status: "inactive",
      lastLogin: "2024-01-15 16:45:00",
      department: "Application Review"
    },
    {
      id: 4,
      name: "Fatma Ali",
      email: "fatma.ali@gov.eg",
      role: "Admin",
      status: "active",
      lastLogin: "2024-01-19 09:20:00",
      department: "Housing Authority"
    },
    {
      id: 5,
      name: "Omar Khalid",
      email: "omar.khalid@gov.eg",
      role: "Reviewer",
      status: "active",
      lastLogin: "2024-01-20 13:00:00",
      department: "Application Review"
    },
    {
      id: 6,
      name: "Nadia Mahmoud",
      email: "nadia.mahmoud@gov.eg",
      role: "Viewer",
      status: "active",
      lastLogin: "2024-01-18 11:30:00",
      department: "Reports"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Reviewer',
    department: ''
  });

  const handleToggleStatus = (userId) => {
    // In a real app, this would update the backend
    alert(`User status toggled successfully!`);
  };

  const handleAddUser = () => {
    // In a real app, this would add to backend
    console.log('Adding user:', newUser);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'Reviewer', department: '' });
    alert('User added successfully!');
  };

  const getRoleBadge = (role) => {
    const badgeClass = {
      admin: 'bg-danger',
      reviewer: 'bg-primary',
      viewer: 'bg-secondary'
    }[role.toLowerCase()] || 'bg-secondary';

    return <span className={`badge ${badgeClass}`}>{role}</span>;
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <span className="badge bg-success">Active</span>
      : <span className="badge bg-secondary">Inactive</span>;
  };

  return (
    <div className="roles">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">User Roles Management</h2>
          <p className="text-muted mb-0">Manage user roles and permissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-person-plus me-2"></i>
          Add New User
        </button>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4 pb-3">
          <h5 className="mb-0">
            <i className="bi bi-people me-2 text-primary"></i>
            Users List ({users.length})
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-person text-primary"></i>
                        </div>
                        <div className="fw-semibold">{user.name}</div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.department}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>
                      <small className="text-muted">
                        {new Date(user.lastLogin).toLocaleDateString()} {new Date(user.lastLogin).toLocaleTimeString()}
                      </small>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          title="Edit User"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className={`btn btn-sm ${user.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                        >
                          <i className={`bi ${user.status === 'active' ? 'bi-pause' : 'bi-play'}`}></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          title="Delete User"
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

      {/* Role Permissions Info */}
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title text-danger">
                <i className="bi bi-shield-check me-2"></i>
                Admin Role
              </h6>
              <ul className="list-unstyled small">
                <li><i className="bi bi-check-circle text-success me-2"></i>Full system access</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Manage all users</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Approve/reject applications</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Manage projects</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>View all reports</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title text-primary">
                <i className="bi bi-eye me-2"></i>
                Reviewer Role
              </h6>
              <ul className="list-unstyled small">
                <li><i className="bi bi-check-circle text-success me-2"></i>View applications</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Approve/reject applications</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>View projects</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Generate reports</li>
                <li><i className="bi bi-x-circle text-danger me-2"></i>Cannot manage users</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title text-secondary">
                <i className="bi bi-bar-chart me-2"></i>
                Viewer Role
              </h6>
              <ul className="list-unstyled small">
                <li><i className="bi bi-check-circle text-success me-2"></i>View applications only</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>View projects only</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>View basic reports</li>
                <li><i className="bi bi-x-circle text-danger me-2"></i>Cannot approve/reject</li>
                <li><i className="bi bi-x-circle text-danger me-2"></i>Cannot edit data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person-plus me-2"></i>
                  Add New User
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.department}
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                    placeholder="Enter department"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Reviewer">Reviewer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleAddUser}
                >
                  <i className="bi bi-check-lg me-2"></i>
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
