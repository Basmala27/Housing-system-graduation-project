import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NewApplication = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    applicantName: '',
    nationalId: '',
    applicantEmail: '',
    applicantPhone: '',
    projectName: '',
    projectId: '',
    income: '',
    familySize: '',
    currentHousing: '',
    requestedUnitType: '2BR',
    preferredFloor: 'Any',
    paymentMethod: 'installments',
    specialRequirements: ''
  });
  
  const [uploadedFiles, setUploadedFiles] = useState({
    nationalIdCopy: null,
    incomeCertificate: null,
    birthCertificate: null,
    otherDocuments: []
  });
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = () => {
      try {
        // Use static projects for now to avoid dataService issues
        const staticProjects = [
          { id: 'proj_001', name: 'New Cairo Housing', status: 'active' },
          { id: 'proj_002', name: 'Alexandria Coastal', status: 'active' },
          { id: 'proj_003', name: 'Cairo Suburbs', status: 'active' }
        ];
        setProjects(staticProjects);
        console.log('Loaded static projects:', staticProjects.length);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setError('Failed to load projects');
      }
    };

    loadProjects();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-set projectId when projectName changes
    if (name === 'projectName') {
      const selectedProject = projects.find(project => project.name === value);
      if (selectedProject) {
        setFormData(prev => ({
          ...prev,
          projectId: selectedProject.id
        }));
      }
    }
  };

  // Handle file uploads
  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      
      // Simulate file upload
      setTimeout(() => {
        setUploadedFiles(prev => ({
          ...prev,
          [fileType]: {
            name: file.name,
            size: file.size,
            type: file.type,
            url: `uploaded_${file.name}`
          }
        }));
        setUploading(false);
      }, 1000);
    }
  };

  // Validate form
  const validateForm = () => {
    const required = ['applicantName', 'nationalId', 'applicantEmail', 'applicantPhone', 'projectName', 'income', 'familySize', 'currentHousing'];
    
    for (const field of required) {
      if (!formData[field] || formData[field].trim() === '') {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`);
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.applicantEmail)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate phone
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(formData.applicantPhone)) {
      setError('Phone number must start with 01 and be 11 digits');
      return false;
    }

    // Validate national ID
    const nationalIdRegex = /^[0-9]{14}$/;
    if (!nationalIdRegex.test(formData.nationalId)) {
      setError('National ID must be exactly 14 digits');
      return false;
    }

    // Validate income
    const income = parseFloat(formData.income);
    if (isNaN(income) || income <= 0) {
      setError('Income must be a positive number');
      return false;
    }

    // Validate family size
    const familySize = parseInt(formData.familySize);
    if (isNaN(familySize) || familySize < 1 || familySize > 20) {
      setError('Family size must be between 1 and 20');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simple submission without dataService for now
      console.log('Form submitted:', formData);
      
      setSuccess('Application submitted successfully! Redirecting to applications...');
      
      // Redirect to applications page after 2 seconds
      setTimeout(() => {
        navigate('/applications');
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      applicantName: '',
      nationalId: '',
      applicantEmail: '',
      applicantPhone: '',
      projectName: '',
      projectId: '',
      income: '',
      familySize: '',
      currentHousing: '',
      requestedUnitType: '2BR',
      preferredFloor: 'Any',
      paymentMethod: 'installments',
      specialRequirements: ''
    });
    setUploadedFiles({
      nationalIdCopy: null,
      incomeCertificate: null,
      birthCertificate: null,
      otherDocuments: []
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="mb-1">
                    <i className="bi bi-file-earmark-plus me-2"></i>
                    New Housing Application
                  </h2>
                  <p className="text-muted mb-0">Submit your housing application</p>
                </div>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/applications')}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Applications
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="alert alert-success d-flex align-items-center mb-4">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    <i className="bi bi-person me-2"></i>
                    Personal Information
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="applicantName"
                        value={formData.applicantName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">National ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleInputChange}
                        placeholder="14-digit National ID"
                        maxLength={14}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="applicantEmail"
                        value={formData.applicantEmail}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="applicantPhone"
                        value={formData.applicantPhone}
                        onChange={handleInputChange}
                        placeholder="01xxxxxxxxx"
                        maxLength={11}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Project Information */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    <i className="bi bi-building me-2"></i>
                    Project Information
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Preferred Project *</label>
                      <select
                        className="form-select"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a project</option>
                        {projects.map(project => (
                          <option key={project.id} value={project.name}>
                            {project.name} - {project.location}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Requested Unit Type</label>
                      <select
                        className="form-select"
                        name="requestedUnitType"
                        value={formData.requestedUnitType}
                        onChange={handleInputChange}
                      >
                        <option value="1BR">1 Bedroom</option>
                        <option value="2BR">2 Bedrooms</option>
                        <option value="3BR">3 Bedrooms</option>
                        <option value="Studio">Studio</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Preferred Floor</label>
                      <select
                        className="form-select"
                        name="preferredFloor"
                        value={formData.preferredFloor}
                        onChange={handleInputChange}
                      >
                        <option value="Any">Any</option>
                        <option value="Ground">Ground Floor</option>
                        <option value="1st">1st Floor</option>
                        <option value="2nd">2nd Floor</option>
                        <option value="3rd">3rd Floor</option>
                        <option value="4th">4th Floor</option>
                        <option value="5th">5th Floor</option>
                        <option value="6th+">6th Floor or above</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Payment Method</label>
                      <select
                        className="form-select"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                      >
                        <option value="installments">Installments</option>
                        <option value="cash">Cash</option>
                        <option value="bank_loan">Bank Loan</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    <i className="bi bi-currency-dollar me-2"></i>
                    Financial Information
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Monthly Income (EGP) *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="income"
                        value={formData.income}
                        onChange={handleInputChange}
                        placeholder="Enter monthly income"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Family Size *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="familySize"
                        value={formData.familySize}
                        onChange={handleInputChange}
                        placeholder="Number of family members"
                        min="1"
                        max="20"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Housing Information */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    <i className="bi bi-house me-2"></i>
                    Current Housing
                  </h5>
                  <div className="mb-3">
                    <label className="form-label">Current Housing Situation *</label>
                    <textarea
                      className="form-control"
                      name="currentHousing"
                      value={formData.currentHousing}
                      onChange={handleInputChange}
                      placeholder="Describe your current housing situation..."
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Special Requirements</label>
                    <textarea
                      className="form-control"
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or preferences..."
                      rows="2"
                    ></textarea>
                  </div>
                </div>

                {/* Document Upload */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Required Documents
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">National ID Copy *</label>
                      <input
                        type="file"
                        className="form-control"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'nationalIdCopy')}
                        required
                      />
                      {uploadedFiles.nationalIdCopy && (
                        <small className="text-success">
                          <i className="bi bi-check-circle me-1"></i>
                          {uploadedFiles.nationalIdCopy.name}
                        </small>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Income Certificate *</label>
                      <input
                        type="file"
                        className="form-control"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'incomeCertificate')}
                        required
                      />
                      {uploadedFiles.incomeCertificate && (
                        <small className="text-success">
                          <i className="bi bi-check-circle me-1"></i>
                          {uploadedFiles.incomeCertificate.name}
                        </small>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Birth Certificate *</label>
                      <input
                        type="file"
                        className="form-control"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'birthCertificate')}
                        required
                      />
                      {uploadedFiles.birthCertificate && (
                        <small className="text-success">
                          <i className="bi bi-check-circle me-1"></i>
                          {uploadedFiles.birthCertificate.name}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || uploading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Submit Application
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewApplication;
