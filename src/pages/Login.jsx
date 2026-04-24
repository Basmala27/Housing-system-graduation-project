import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-bootstrap';
import { logUserAction } from '../utils/auditLogger';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Check localStorage for existing users first
      const savedUsers = localStorage.getItem('housingUsers');
      let users = [];
      if (savedUsers) {
        users = JSON.parse(savedUsers);
      }

      // Add default admin user if no users exist
      if (users.length === 0) {
        users = [
          { email: 'admin@gov.eg', password: 'admin123', name: 'Admin User', role: 'admin' }
        ];
        localStorage.setItem('housingUsers', JSON.stringify(users));
      }

      // Find user by email
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Create mock token
        const token = btoa(JSON.stringify({ email, timestamp: Date.now() }));
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Log real audit entry for login
        logUserAction(user._id || 'unknown', user.name, 'login', user.name);
        
        login(user, token);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#004085', 
        color: 'white', 
        padding: '20px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <i className="bi bi-building-gov me-3" style={{ fontSize: '1.5rem' }}></i>
                <div>
                  <h1 className="mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>
                    Government Housing Management System
                  </h1>
                  <p className="mb-0 opacity-75" style={{ fontSize: '0.9rem' }}>
                    Admin Portal Login
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 text-end">
              <div className="d-flex align-items-center justify-content-end">
                <i className="bi bi-shield-check me-2" style={{ fontSize: '1.2rem' }}></i>
                <span style={{ fontSize: '0.9rem' }}>Secure Access</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        padding: '40px 20px'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-lg border-0" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                  {/* Logo Section */}
                  <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 p-3 mb-3">
                      <i className="bi bi-person-lock text-primary" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h3 className="card-title text-dark fw-bold mb-2">
                      Welcome Back
                    </h3>
                    <p className="text-muted mb-0">
                      Please sign in to your admin account
                    </p>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <Alert variant="danger" className="mb-3" style={{ borderRadius: '8px' }}>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <i className="bi bi-envelope me-2"></i>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        style={{ borderRadius: '8px', border: '1px solid #dee2e6' }}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password" className="form-label fw-semibold">
                        <i className="bi bi-lock me-2"></i>
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        style={{ borderRadius: '8px', border: '1px solid #dee2e6' }}
                        required
                      />
                    </div>

                    <div className="d-grid gap-2 mb-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ 
                          borderRadius: '8px', 
                          padding: '12px',
                          fontWeight: '500'
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Signing in...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Sign In
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg"
                        style={{ borderRadius: '8px' }}
                        onClick={() => { setEmail('admin@gov.eg'); setPassword('admin123'); }}
                      >
                        <i className="bi bi-key me-2"></i>
                        Use Demo
                      </button>
                    </div>

                    {/* Additional Links */}
                    <div className="text-center mb-3">
                      <Link to="/forgot-password" className="text-primary text-decoration-none me-3">
                        <i className="bi bi-question-circle me-1"></i>
                        Forgot Password?
                      </Link>
                      <Link to="/register" className="text-primary text-decoration-none">
                        <i className="bi bi-person-plus me-1"></i>
                        Create Account
                      </Link>
                    </div>
                  </form>

                  {/* Demo Credentials */}
                  <div className="alert alert-info mt-4 mb-0" style={{ borderRadius: '8px' }}>
                    <div className="d-flex align-items-start">
                      <i className="bi bi-info-circle me-2 mt-1"></i>
                      <div>
                        <strong className="d-block mb-1">Demo Credentials:</strong>
                        <div className="small">
                          <div><strong>Email:</strong> admin@gov.eg</div>
                          <div><strong>Password:</strong> admin123</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px 0',
        borderTop: '1px solid #dee2e6'
      }}>
        <div className="container">
          <div className="text-center">
            <small className="text-muted">
              © 2024 Government Housing Management System. All rights reserved.
            </small>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
