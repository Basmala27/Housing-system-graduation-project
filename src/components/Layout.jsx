import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/applications', icon: 'bi-file-earmark-text', label: 'Applications' },
    { path: '/projects', icon: 'bi-building', label: 'Projects' },
    { path: '/roles', icon: 'bi-people', label: 'Roles' },
    { path: '/audit', icon: 'bi-clock-history', label: 'Audit Log' },
    { path: '/reports', icon: 'bi-graph-up', label: 'Reports' },
    { path: '/notifications', icon: 'bi-bell', label: 'Notifications' },
  ];

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className={`bg-dark text-white ${sidebarOpen ? 'col-md-3 col-lg-2' : 'col-md-1'} d-flex flex-column p-0 transition-all`} style={{ minHeight: '100vh' }}>
        {/* Sidebar Header */}
        <div className="p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <i className="bi bi-building-gov fs-4 me-2"></i>
            {sidebarOpen && <span className="fw-bold">Housing Admin</span>}
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-grow-1 overflow-auto">
          <ul className="nav nav-pills flex-column p-3">
            {menuItems.map((item) => (
              <li className="nav-item mb-2" key={item.path}>
                <div
                  className={`nav-link text-white d-flex align-items-center ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                  onClick={() => {
                    console.log(`🔥 Sidebar button clicked: ${item.label}`);
                    console.log(`📍 Navigating to: ${item.path}`);
                    navigate(item.path);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <i className={`bi ${item.icon} me-2`}></i>
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-top border-secondary">
          <button
            className="btn btn-outline-light btn-sm w-100 mb-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
            {sidebarOpen && <span className="ms-2">Collapse</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-2">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <h5 className="mb-0 text-primary">
                  <i className="bi bi-gear-fill me-2"></i>
                  Government Housing Management System
                </h5>
              </div>
              <div className="d-flex align-items-center">
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    {user?.name || 'Admin User'}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>Profile
                      </Link>
                    </li>
                    <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}><i className="bi bi-gear me-2"></i>Settings</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-grow-1 p-4 bg-light">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
