import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import dataService from '../services/dataService';

const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Get user details using data service with fallback
  const getUserDetails = (application) => {
    try {
      // Try data service first
      const user = dataService.getApplicationUser(application);
      if (user && user.name !== 'Unknown User') {
        return user;
      }
      
      // Fallback for direct data access
      if (application.applicationData) {
        return {
          id: application.userId || application.id || 'unknown',
          name: application.applicationData.applicantName || 'Unknown User',
          email: application.applicationData.applicantEmail || 'unknown@example.com',
          phone: application.applicationData.applicantPhone || 'N/A',
          role: 'citizen',
          isVerified: false
        };
      }
      
      // Backend applications have name, email, phone directly
      if (application.name) {
        return {
          id: application.userId || application._id || 'unknown',
          name: application.name,
          email: application.email || 'unknown@example.com',
          phone: application.phone || 'N/A',
          role: 'citizen',
          isVerified: false
        };
      }
      
      return {
        id: 'unknown',
        name: 'Unknown User',
        email: 'unknown@example.com',
        phone: 'N/A',
        role: 'citizen',
        isVerified: false
      };
    } catch (error) {
      console.error('Error getting user details:', error);
      return {
        id: 'unknown',
        name: 'Unknown User',
        email: 'unknown@example.com',
        phone: 'N/A',
        role: 'citizen',
        isVerified: false
      };
    }
  };

  // Get project details using data service
  const getProjectDetails = (projectId) => {
    return dataService.getProject(projectId);
  };

  // Fetch application details using data service
  const fetchApplicationDetails = () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching application details for ID:', id);
      
      const foundApplication = dataService.getApplication(id);
      
      if (foundApplication) {
        console.log('Application found:', foundApplication.id);
        setApplication(foundApplication);
      } else {
        console.error('Application not found with ID:', id);
        throw new Error(`Application not found with ID: ${id}`);
      }
    } catch (err) {
      console.error('Error fetching application details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update application status using data service
  const updateStatus = async (newStatus, rejectionReason = null) => {
    try {
      setUpdating(true);
      
      // Use data service to update status
      const updatedApplication = dataService.updateApplicationStatus(id, newStatus, rejectionReason, 'Admin');
      
      // Update local state
      setApplication(updatedApplication);
      
      console.log('Application status updated successfully:', updatedApplication.status);
      
      alert(`Application ${newStatus} successfully!`);
    } catch (err) {
      console.error(`Error ${newStatus}ing application:`, err);
      alert(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Handle approve
  const handleApprove = () => {
    if (window.confirm('Are you sure you want to approve this application?')) {
      updateStatus('approved');
    }
  };

  // Handle reject
  const handleReject = () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason && reason.trim()) {
      updateStatus('rejected', reason.trim());
    } else if (reason === null) {
      // User cancelled
      return;
    } else {
      alert('Please provide a valid rejection reason');
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badgeClass = {
      pending: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-danger'
    }[status] || 'bg-secondary';

    return <span className={`badge ${badgeClass}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  // Format date
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

  // Setup data service subscription and initial load
  useEffect(() => {
    fetchApplicationDetails();
    
    // Subscribe to data changes for live updates
    const unsubscribe = dataService.subscribe((changeType, data, cache) => {
      console.log('ApplicationDetails received data change:', changeType);
      if (changeType === 'application_status_updated' || changeType === 'application_deleted') {
        fetchApplicationDetails();
      }
    });
    
    return () => unsubscribe();
  }, [id]);

  return (
    <div className="application-details">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Application Details</h2>
          <p className="text-muted mb-0">
            {loading ? 'Loading...' : `Application #${id?.slice(-8)}`}
            {error && <span className="text-warning ms-2">(Connection issue)</span>}
          </p>
        </div>
        <Link to="/applications" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to List
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <div>
            <strong>Error:</strong> {error}
            <div className="small mt-1">
              Please ensure backend is running on <code>http://localhost:5000</code>
            </div>
          </div>
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

      {/* Application Details */}
      {!loading && !error && application && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="row g-4">
              {/* Applicant Information */}
              <div className="col-12">
                <h5 className="mb-3">
                  <i className="bi bi-person me-2"></i>
                  Applicant Information
                </h5>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Full Name</label>
                <p className="form-control-plaintext">
                  {getUserDetails(application)?.name || 'Unknown User'}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Email Address</label>
                <p className="form-control-plaintext">
                  {getUserDetails(application)?.email || 'unknown@example.com'}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Phone Number</label>
                <p className="form-control-plaintext">
                  {getUserDetails(application)?.phone || 'N/A'}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">National ID</label>
                <p className="form-control-plaintext">{application.nationalId}</p>
              </div>

              {/* Project Information */}
              <div className="col-12">
                <h5 className="mb-3 mt-4">
                  <i className="bi bi-building me-2"></i>
                  Project Information
                </h5>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Project Name</label>
                <p className="form-control-plaintext">
                  {getProjectDetails(application.projectId)?.name || application.projectName || 'Unknown Project'}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Application Status</label>
                <p>{getStatusBadge(application.status)}</p>
              </div>

              {/* Financial Information */}
              <div className="col-12">
                <h5 className="mb-3 mt-4">
                  <i className="bi bi-currency-dollar me-2"></i>
                  Financial Information
                </h5>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Monthly Income</label>
                <p className="form-control-plaintext">
                  {application.income || application.applicationData?.income || 'N/A'} EGP
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Family Size</label>
                <p className="form-control-plaintext">
                  {application.familySize || application.applicationData?.familySize || 'N/A'} members
                </p>
              </div>

              {/* Housing Information */}
              <div className="col-12">
                <h5 className="mb-3 mt-4">
                  <i className="bi bi-house me-2"></i>
                  Current Housing
                </h5>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">Current Housing Details</label>
                <p className="form-control-plaintext">
                  {application.currentHousing || application.applicationData?.currentHousing || 'N/A'}
                </p>
              </div>

              {/* Application Preferences */}
              <div className="col-12">
                <h5 className="mb-3 mt-4">
                  <i className="bi bi-gear me-2"></i>
                  Application Preferences
                </h5>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Requested Unit Type</label>
                <p className="form-control-plaintext">
                  {application.applicationData?.requestedUnitType || 'N/A'}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Preferred Floor</label>
                <p className="form-control-plaintext">
                  {application.applicationData?.preferredFloor || 'N/A'}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Payment Method</label>
                <p className="form-control-plaintext">
                  {application.applicationData?.paymentMethod || 'N/A'}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Special Requirements</label>
                <p className="form-control-plaintext">
                  {application.applicationData?.specialRequirements || 'None'}
                </p>
              </div>

              {/* Documents Section */}
              <div className="col-12">
                <h5 className="mb-3 mt-4">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Submitted Documents
                </h5>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">National ID Copy</label>
                <p className="form-control-plaintext">
                  {application.documents?.nationalIdCopy || 'Not uploaded'}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Income Certificate</label>
                <p className="form-control-plaintext">
                  {application.documents?.incomeCertificate || 'Not uploaded'}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Birth Certificate</label>
                <p className="form-control-plaintext">
                  {application.documents?.birthCertificate || 'Not uploaded'}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Other Documents</label>
                <p className="form-control-plaintext">
                  {application.documents?.otherDocuments?.length > 0 
                    ? `${application.documents.otherDocuments.length} files uploaded`
                    : 'None'
                  }
                </p>
              </div>

              {/* Submission Information */}
              <div className="col-12">
                <h5 className="mb-3 mt-4">
                  <i className="bi bi-calendar me-2"></i>
                  Submission Information
                </h5>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Submitted On</label>
                <p className="form-control-plaintext">{formatDate(application.submittedAt || application.createdAt)}</p>
              </div>

              {/* Review Information (if not pending) */}
              {application.status !== 'pending' && (
                <>
                  <div className="col-12">
                    <h5 className="mb-3 mt-4">
                      <i className="bi bi-check-circle me-2"></i>
                      Review Information
                    </h5>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Reviewed By</label>
                    <p className="form-control-plaintext">{application.reviewedBy}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Reviewed At</label>
                    <p className="form-control-plaintext">{formatDate(application.reviewedAt)}</p>
                  </div>
                  {application.rejectionReason && (
                    <div className="col-12">
                      <label className="form-label fw-bold">Rejection Reason</label>
                      <div className="alert alert-danger">
                        {application.rejectionReason}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Action Buttons */}
              {application.status === 'pending' && (
                <div className="col-12">
                  <div className="d-flex gap-2 mt-4">
                    <button 
                      className="btn btn-success"
                      onClick={handleApprove}
                      disabled={updating}
                    >
                      {updating ? (
                        <span className="spinner-border spinner-border-sm me-1"></span>
                      ) : (
                        <i className="bi bi-check-circle me-1"></i>
                      )}
                      Approve Application
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={handleReject}
                      disabled={updating}
                    >
                      {updating ? (
                        <span className="spinner-border spinner-border-sm me-1"></span>
                      ) : (
                        <i className="bi bi-x-circle me-1"></i>
                      )}
                      Reject Application
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;
