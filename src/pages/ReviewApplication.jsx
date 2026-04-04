import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ReviewApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Simple fallback data
  const fallbackApplication = {
    _id: id || 'fallback-1',
    name: 'mahmoud el sayed ahmed',
    email: 'mahmoud@gamil.com',
    phone: '01289215667',
    projectName: 'new cairo',
    status: 'pending',
    createdAt: new Date('2026-04-02T20:36:16.919Z'),
    nationalId: '12345678955534',
    familySize: 4,
    income: 12000,
    currentHousing: 'I live in Alexandria with my family',
    documents: {
      nationalIdCopy: 'uploaded',
      incomeCertificate: 'uploaded',
      birthCertificate: 'uploaded'
    }
  };

  // Load application data
  useEffect(() => {
    console.log('Loading application with ID:', id);
    
    // Force refresh localStorage data
    try {
      const savedApplications = localStorage.getItem('housingApplications');
      console.log('Raw localStorage data:', savedApplications);
      
      if (savedApplications) {
        const applications = JSON.parse(savedApplications);
        console.log('Parsed applications:', applications);
        console.log('Looking for application with ID:', id);
        console.log('Available application IDs:', applications.map(app => app._id || app.id));
        
        // Better ID matching - check both _id and id fields
        const foundApplication = applications.find(app => {
          const appId = app._id || app.id;
          const appNationalId = app.nationalId;
          
          console.log('Checking application:', {
            id: appId,
            nationalId: appNationalId,
            name: app.name,
            status: app.status
          });
          
          console.log('Looking for ID:', id, 'vs appId:', appId, 'Match:', appId === id);
          
          // Try exact ID match first
          if (appId === id) {
            console.log('✅ Found by exact ID match');
            return true;
          }
          
          // If not found by ID, try to find by national ID (in case ID is actually national ID)
          if (appNationalId === id) {
            console.log('✅ Found by national ID match');
            return true;
          }
          
          return false;
        });
        
        // Get the actual application object that matched
        const actualApplication = applications.find(app => {
          const appId = app._id || app.id;
          const appNationalId = app.nationalId;
          return appId === id || appNationalId === id;
        });
        
        console.log('Found application:', actualApplication);
        
        if (actualApplication) {
          console.log('✅ Found application in localStorage:', actualApplication);
          setApplication(actualApplication);
          setLoading(false);
          return;
        } else {
          console.log('⚠️ Application not found in localStorage');
          console.log('Available IDs:', applications.map(app => ({ id: app._id || app.id, nationalId: app.nationalId, name: app.name })));
        }
      } else {
        console.log('⚠️ No applications found in localStorage');
      }
    } catch (err) {
      console.error('❌ Error loading from localStorage:', err);
    }
    
    // Only use fallback if absolutely necessary
    console.log('⚠️ Using fallback application data');
    setApplication(fallbackApplication);
    setLoading(false);
  }, [id]);

  // Add refresh effect to check for data changes
  useEffect(() => {
    const checkForUpdates = () => {
      try {
        const savedApplications = localStorage.getItem('housingApplications');
        if (savedApplications) {
          const applications = JSON.parse(savedApplications);
          const foundApplication = applications.find(app => (app._id || app.id) === id);
          
          if (foundApplication && (!application || application._id !== foundApplication._id)) {
            console.log('🔄 Application data updated, refreshing...');
            setApplication(foundApplication);
          }
        }
      } catch (err) {
        console.error('❌ Error checking for updates:', err);
      }
    };

    // Check immediately and then every 2 seconds
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 2000);
    
    return () => clearInterval(interval);
  }, [id, application?._id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badgeClass = {
      pending: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-danger'
    }[status] || 'bg-secondary';

    return <span className={`badge ${badgeClass}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const handleApprove = async () => {
    if (!application) return;

    try {
      setUpdateLoading(true);
      
      // Update local state immediately
      const updatedApplication = {
        ...application,
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Admin User'
      };
      
      setApplication(updatedApplication);
      
      // Save to localStorage
      try {
        const savedApplications = localStorage.getItem('housingApplications');
        if (savedApplications) {
          const applications = JSON.parse(savedApplications);
          const updatedApplications = applications.map(app => 
            app._id === application._id ? updatedApplication : app
          );
          localStorage.setItem('housingApplications', JSON.stringify(updatedApplications));
          console.log('✅ Application approved and saved to localStorage');
        }
      } catch (err) {
        console.error('❌ Error saving to localStorage:', err);
      }
      
      setSuccessMessage('Application approved successfully!');
      
      // Navigate after 2 seconds
      setTimeout(() => {
        navigate('/applications');
      }, 2000);
    } catch (error) {
      console.error('Error approving application:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleReject = async () => {
    if (!application || !rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setUpdateLoading(true);
      
      // Update local state immediately
      const updatedApplication = {
        ...application,
        status: 'rejected',
        rejectionReason: rejectReason.trim(),
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Admin User'
      };
      
      setApplication(updatedApplication);
      
      // Save to localStorage
      try {
        const savedApplications = localStorage.getItem('housingApplications');
        if (savedApplications) {
          const applications = JSON.parse(savedApplications);
          const updatedApplications = applications.map(app => 
            app._id === application._id ? updatedApplication : app
          );
          localStorage.setItem('housingApplications', JSON.stringify(updatedApplications));
          console.log('✅ Application rejected and saved to localStorage');
        }
      } catch (err) {
        console.error('❌ Error saving to localStorage:', err);
      }
      
      setSuccessMessage('Application rejected successfully!');
      
      // Navigate after 2 seconds
      setTimeout(() => {
        navigate('/applications');
      }, 2000);
    } catch (error) {
      console.error('Error rejecting application:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container p-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container p-4">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Application not found
        </div>
        <Link to="/applications" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="container p-4">
      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle me-2"></i>
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}

      {/* Update Error */}
      {updateError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {updateError}
          <button type="button" className="btn-close" onClick={() => setUpdateError('')}></button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2 text-muted">Loading application details...</div>
        </div>
      )}

      {/* Application Not Found */}
      {!loading && !application && (
        <div className="text-center py-5">
          <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
          <h4 className="mt-3 text-warning">Application Not Found</h4>
          <p className="text-muted">The application you're looking for doesn't exist or has been removed.</p>
          <Link to="/applications" className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Applications
          </Link>
        </div>
      )}

      {/* Application Details */}
      {!loading && application && (
        <>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Application Review</h2>
              <p className="text-muted mb-0">
                Application #{application._id ? application._id.slice(-8) : 'Unknown'} • 
                Submitted {application.createdAt ? formatDate(application.createdAt) : 'Unknown date'}
              </p>
            </div>
            <div>
              {getStatusBadge(application.status || 'pending')}
            </div>
          </div>

          {/* Navigation */}
          <div className="mb-4">
            <Link to="/applications" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Applications
            </Link>
          </div>

          {/* Application Info */}
          <div className="row">
            {/* Applicant Information */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <i className="bi bi-person me-2"></i>
                    Applicant Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-sm-4">
                      <strong>Name:</strong>
                    </div>
                    <div className="col-sm-8">{application.name || 'N/A'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4">
                      <strong>Email:</strong>
                    </div>
                    <div className="col-sm-8">{application.email || 'N/A'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4">
                      <strong>Phone:</strong>
                    </div>
                    <div className="col-sm-8">{application.phone || 'N/A'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4">
                      <strong>National ID:</strong>
                    </div>
                    <div className="col-sm-8">{application.nationalId || 'N/A'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4">
                      <strong>Family Size:</strong>
                    </div>
                    <div className="col-sm-8">{application.familySize || 'N/A'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4">
                      <strong>Income:</strong>
                    </div>
                    <div className="col-sm-8">${application.income || 'N/A'}/month</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <strong>Current Housing:</strong>
                    </div>
                    <div className="col-sm-8">{application.currentHousing || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <i className="bi bi-building me-2"></i>
                    Project Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-sm-4">
                      <strong>Project:</strong>
                    </div>
                    <div className="col-sm-8">{application.projectName || 'N/A'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4">
                      <strong>Status:</strong>
                    </div>
                    <div className="col-sm-8">{getStatusBadge(application.status || 'pending')}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4">
                      <strong>Submitted:</strong>
                    </div>
                    <div className="col-sm-8">{application.createdAt ? formatDate(application.createdAt) : 'N/A'}</div>
                  </div>
                  {application.reviewedAt && (
                    <>
                      <div className="row mb-3">
                        <div className="col-sm-4">
                          <strong>Reviewed:</strong>
                        </div>
                        <div className="col-sm-8">{formatDate(application.reviewedAt)}</div>
                      </div>
                      <div className="row">
                        <div className="col-sm-4">
                          <strong>Reviewed By:</strong>
                        </div>
                        <div className="col-sm-8">{application.reviewedBy || 'N/A'}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <i className="bi bi-gear me-2"></i>
                    Application Review
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-lg px-4"
                          style={{ 
                            cursor: updateLoading ? 'not-allowed' : 'pointer',
                            zIndex: 1000,
                            pointerEvents: 'auto',
                            position: 'relative'
                          }}
                          onClick={() => {
                            console.log('🔥 Approve button clicked in ReviewApplication');
                            
                            // Confirm before approving
                            if (application && window.confirm(`Are you sure you want to approve this application?\n\nApplicant: ${application.name}\nProject: ${application.projectName}\nEmail: ${application.email}`)) {
                              handleApprove();
                            }
                          }}
                          disabled={updateLoading}
                        >
                          {updateLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Processing...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-2"></i>
                              Approve Application
                            </>
                          )}
                        </button>
                        
                        <button
                          className="btn btn-danger btn-lg px-4"
                          style={{ 
                            cursor: updateLoading ? 'not-allowed' : 'pointer',
                            zIndex: 1000,
                            pointerEvents: 'auto',
                            position: 'relative'
                          }}
                          onClick={() => {
                            console.log('🔥 Reject button clicked in ReviewApplication');
                            setShowRejectReason(true);
                          }}
                          disabled={updateLoading}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Reject Application
                        </button>
                      </div>

                      {/* Rejection Reason */}
                      {showRejectReason && (
                        <div className="mt-4 p-3 bg-light rounded">
                          <h6 className="mb-3">Rejection Reason</h6>
                          <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Please provide a detailed reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                          ></textarea>
                          <div className="mt-3 d-flex gap-2">
                            <button
                              className="btn btn-danger"
                              onClick={handleReject}
                              disabled={updateLoading || !rejectReason.trim()}
                            >
                              {updateLoading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-x-circle me-2"></i>
                                  Submit Rejection
                                </>
                              )}
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => {
                                setShowRejectReason(false);
                                setRejectReason('');
                              }}
                              disabled={updateLoading}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewApplication;
