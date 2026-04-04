import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Applications from './pages/Applications';
import ReviewApplication from './pages/ReviewApplication';
import NewApplication from './pages/NewApplication';
import Projects from './pages/Projects';
import Roles from './pages/Roles';
import Audit from './pages/Audit';
import Reports from './pages/Reports';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  console.log('App component is rendering...');
  
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <Layout>
                  <Applications />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/applications/new" element={
              <ProtectedRoute>
                <Layout>
                  <NewApplication />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/review/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ReviewApplication />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <Layout>
                  <Projects />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/roles" element={
              <ProtectedRoute>
                <Layout>
                  <Roles />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/audit" element={
              <ProtectedRoute>
                <Layout>
                  <Audit />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
