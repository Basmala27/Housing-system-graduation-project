import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applications } from '../data/applications';

const ReviewApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Find the application by ID
  const application = applications.find(app => app.id === parseInt(id));

  if (!application) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
        <h3 className="mt-3">Application Not Found</h3>
        <p className="text-muted">The application you're looking for doesn't exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/applications')}>
          Back to Applications
        </button>
      </div>
    );
  }

  const handleApprove = () => {
    setProcessing(true);
    setTimeout(() => {
      // In a real app, this would update the backend
      alert('Application approved successfully!');
      navigate('/applications');
      setProcessing(false);
    }, 1000);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    
    setProcessing(true);
    setTimeout(() => {
      // In a real app, this would update the backend
      alert(`Application rejected. Reason: ${rejectReason}`);
      navigate('/applications');
      setProcessing(false);
    }, 1000);
  };

  return (
    <div className="review-application">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Review Application</h2>
          <p className="text-muted mb-0">
            Application #{application.id.toString().padStart(4, '0')} - {application.name}
          </p>
        </div>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/applications')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Applications
        </button>
      </div>

      <div className="row">
        {/* Applicant Information */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 pb-3">
              <h5 className="mb-0">
                <i className="bi bi-person me-2 text-primary"></i>
                Applicant Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="text-muted small">Full Name</label>
                  <p className="mb-3 fw-semibold">{application.name}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Email Address</label>
                  <p className="mb-3">{application.email}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Phone Number</label>
                  <p className="mb-3">{application.phone}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">National ID</label>
                  <p className="mb-3">{application.nationalId}</p>
                </div>
                <div className="col-12">
                  <label className="text-muted small">Address</label>
                  <p className="mb-3">{application.address}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Monthly Income</label>
                  <p className="mb-3 fw-semibold text-success">
                    ${application.income.toLocaleString()}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Family Size</label>
                  <p className="mb-3">{application.familySize} members</p>
                </div>
                <div className="col-12">
                  <label className="text-muted small">Current Housing</label>
                  <p className="mb-0">{application.currentHousing}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 pb-3">
              <h5 className="mb-0">
                <i className="bi bi-building me-2 text-primary"></i>
                Project Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="text-muted small">Applied Project</label>
                  <p className="mb-3 fw-semibold">{application.project}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Submission Date</label>
                  <p className="mb-3">
                    {new Date(application.submissionDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Current Status</label>
                  <p className="mb-3">
                    <span className={`badge bg-${
                      application.status === 'pending' ? 'warning' : 
                      application.status === 'approved' ? 'success' : 'danger'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </p>
                </div>
                
                {/* Documents Section */}
                <div className="col-12">
                  <label className="text-muted small">Submitted Documents</label>
                  <div className="mt-2">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                      <span>National ID Copy</span>
                      <button className="btn btn-sm btn-outline-primary ms-auto">View</button>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                      <span>Income Certificate</span>
                      <button className="btn btn-sm btn-outline-primary ms-auto">View</button>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                      <span>Birth Certificate</span>
                      <button className="btn btn-sm btn-outline-primary ms-auto">View</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4 pb-3">
          <h5 className="mb-0">
            <i className="bi bi-gear me-2 text-primary"></i>
            Review Actions
          </h5>
        </div>
        <div className="card-body">
          {application.status === 'pending' ? (
            <>
              <div className="row">
                <div className="col-md-8">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-lg px-4"
                      onClick={handleApprove}
                      disabled={processing}
                    >
                      {processing ? (
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
                      onClick={() => setShowRejectReason(true)}
                      disabled={processing}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Reject Application
                    </button>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-clock me-2"></i>
                    Review Later
                  </button>
                </div>
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
                      disabled={processing || !rejectReason.trim()}
                    >
                      {processing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-x-circle me-2"></i>
                          Confirm Rejection
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => { setShowRejectReason(false); setRejectReason(''); }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              This application has already been {application.status}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewApplication;
