import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('🔐 ProtectedRoute check:', { loading, isAuthenticated, userRole: user?.role, adminOnly });

  if (loading) {
    console.log('🔐 ProtectedRoute: Still loading...');
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔐 ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if admin-only route and user is not admin
  if (adminOnly && user?.role !== 'admin') {
    console.log('🔐 ProtectedRoute: User not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('🔐 ProtectedRoute: Access granted');
  return children;
};

export default ProtectedRoute;
