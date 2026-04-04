import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NewApplication = () => {
  const navigate = useNavigate();
  
  // Save applications to localStorage
  const saveApplicationsToStorage = (applications) => {
    try {
      localStorage.setItem('housingApplications', JSON.stringify(applications));
      console.log('✅ New application saved to localStorage:', applications.length);
    } catch (err) {
      console.error('❌ Failed to save application to localStorage:', err);
    }
  };

  // Load applications from localStorage
  const loadApplicationsFromStorage = () => {
    try {
      const saved = localStorage.getItem('housingApplications');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('📥 Loaded applications from localStorage:', parsed.length);
        return parsed;
      }
    } catch (err) {
      console.error('❌ Failed to load applications from localStorage:', err);
    }
    return [];
  };

  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    email: '',
    phone: '',
    projectName: '',
    income: '',
    familySize: '',
    currentHousing: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Error display component
  const ErrorAlert = ({ message }) => (
    <div className="alert alert-danger d-flex align-items-center">
      <i className="bi bi-exclamation-triangle me-2"></i>
      {message}
    </div>
  );

  // Success display component
  const SuccessAlert = ({ message }) => (
    <div className="alert alert-success d-flex align-items-center">
      <i className="bi bi-check-circle me-2"></i>
      {message}
    </div>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFieldError = (fieldName) => {
    const errors = {
      name: !formData.name || formData.name.trim() === '' ? 'Name is required' : 
                formData.name.trim().length < 3 ? 'Name must be at least 3 characters' : '',
      
      nationalId: !formData.nationalId || formData.nationalId.trim() === '' ? 'National ID is required' :
                  formData.nationalId.replace(/\D/g, '').length !== 14 ? 'National ID must be exactly 14 digits' : '',
      
      email: !formData.email || formData.email.trim() === '' ? 'Email is required' :
             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Please enter a valid email address' : '',
      
      phone: !formData.phone || formData.phone.trim() === '' ? 'Phone is required' :
              formData.phone.replace(/\D/g, '').length !== 11 || !formData.phone.replace(/\D/g, '').startsWith('01') ? 
              'Phone must start with 01 and be 11 digits' : '',
      
      projectName: !formData.projectName || formData.projectName.trim() === '' ? 'Project name is required' :
                  formData.projectName.trim().length < 3 ? 'Project name must be at least 3 characters' : '',
      
      income: !formData.income || isNaN(parseFloat(formData.income)) || parseFloat(formData.income) <= 0 ? 'Income must be greater than 0' :
               parseFloat(formData.income) > 1000000 ? 'Income seems too high' : '',
      
      familySize: !formData.familySize || isNaN(parseInt(formData.familySize)) || parseInt(formData.familySize) < 1 ? 'Family size must be at least 1' :
                   parseInt(formData.familySize) > 20 ? 'Family size seems too large' : '',
      
      currentHousing: !formData.currentHousing || formData.currentHousing.trim() === '' ? 'Current housing information is required' :
                     formData.currentHousing.trim().length < 10 ? 'Please provide more details (at least 10 characters)' : ''
    };
    
    return errors[fieldName] || '';
  };

  const validateForm = () => {
    // Name validation
    if (!formData.name || formData.name.trim() === '') {
      return 'Name is required';
    }
    if (formData.name.trim().length < 3) {
      return 'Name must be at least 3 characters';
    }

    // National ID validation
    if (!formData.nationalId || formData.nationalId.trim() === '') {
      return 'National ID is required';
    }
    // Remove any non-digit characters first
    const cleanNationalId = formData.nationalId.replace(/\D/g, '');
    if (cleanNationalId.length !== 14) {
      return 'National ID must be exactly 14 digits';
    }

    // Email validation
    if (!formData.email || formData.email.trim() === '') {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone || formData.phone.trim() === '') {
      return 'Phone is required';
    }
    // Remove any non-digit characters first
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      return 'Phone must start with 01 and be 11 digits';
    }

    // Project name validation
    if (!formData.projectName || formData.projectName.trim() === '') {
      return 'Project name is required';
    }
    if (formData.projectName.trim().length < 3) {
      return 'Project name must be at least 3 characters';
    }

    // Income validation
    const incomeValue = parseFloat(formData.income);
    if (!formData.income || isNaN(incomeValue) || incomeValue <= 0) {
      return 'Income must be greater than 0';
    }
    if (incomeValue > 1000000) {
      return 'Income seems too high. Please check the amount.';
    }

    // Family size validation
    const familySizeValue = parseInt(formData.familySize);
    if (!formData.familySize || isNaN(familySizeValue) || familySizeValue < 1) {
      return 'Family size must be at least 1';
    }
    if (familySizeValue > 20) {
      return 'Family size seems too large. Please check the number.';
    }

    // Current housing validation
    if (!formData.currentHousing || formData.currentHousing.trim() === '') {
      return 'Current housing information is required';
    }
    if (formData.currentHousing.trim().length < 10) {
      return 'Please provide more details about current housing (at least 10 characters)';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    console.log('🔥 handleSubmit function called!');
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      console.log('❌ Form validation failed:', validationError);
      setError(validationError);
      return;
    }

    console.log(' Form validation passed, submitting...');
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create new application object
      const newApplication = {
        _id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nationalId: formData.nationalId,
        familySize: formData.familySize,
        income: formData.income,
        currentHousing: formData.currentHousing,
        projectName: formData.projectName,
        status: 'pending',
        createdAt: new Date().toISOString(),
        projectId: '507f1f77bcf86cd799439011' // Default project ID
      };

      console.log(' Creating new application:', newApplication);
      console.log('📝 Creating new application:', newApplication);

      // Load existing applications from localStorage
      const existingApplications = loadApplicationsFromStorage();
      
      // Add new application to the list
      const updatedApplications = [...existingApplications, newApplication];
      
      // Save updated list to localStorage
      saveApplicationsToStorage(updatedApplications);
      console.log('💾 Application saved to localStorage and will appear in applications list');

      // Try API first (optional)
      try {
        const response = await fetch('http://localhost:5000/api/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newApplication)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            console.log('✅ Application saved to backend successfully');
          }
        }
      } catch (apiError) {
        console.log('⚠️ Backend API not available, but localStorage saved');
      }

      setSuccess('✅ Application submitted successfully! Redirecting to applications...');

    } catch (err) {
      console.error('❌ Error submitting application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }

    // Reset form
    setFormData({
      name: '',
      nationalId: '',
      email: '',
      phone: '',
      projectName: '',
      income: '',
      familySize: '',
      currentHousing: ''
    });
    
    console.log('🔄 Form reset, redirecting to applications page...');
    
    // Navigate to applications after 3 seconds
    setTimeout(() => {
      console.log('📍 Navigating to /applications');
      navigate('/applications');
    }, 3000);
  };

  return (
    <div className="container p-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-light">
              <h4 className="mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                New Housing Application
              </h4>
            </div>
            <div className="card-body">
              {/* Success Message */}
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                  <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
              )}

              {/* Error Message */}
              {error && <ErrorAlert message={error} />}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${getFieldError('name') ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    {getFieldError('name') && (
                      <div className="invalid-feedback">
                        {getFieldError('name')}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nationalId" className="form-label">National ID *</label>
                    <input
                      type="text"
                      className={`form-control ${getFieldError('nationalId') ? 'is-invalid' : ''}`}
                      id="nationalId"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleChange}
                      maxLength="14"
                      placeholder="14 digits"
                      required
                    />
                    {getFieldError('nationalId') && (
                      <div className="invalid-feedback">
                        {getFieldError('nationalId')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className={`form-control ${getFieldError('email') ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {getFieldError('email') && (
                      <div className="invalid-feedback">
                        {getFieldError('email')}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className={`form-control ${getFieldError('phone') ? 'is-invalid' : ''}`}
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01xxxxxxxxx"
                      required
                    />
                    {getFieldError('phone') && (
                      <div className="invalid-feedback">
                        {getFieldError('phone')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="projectName" className="form-label">Desired Project *</label>
                    <input
                      type="text"
                      className={`form-control ${getFieldError('projectName') ? 'is-invalid' : ''}`}
                      id="projectName"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      required
                    />
                    {getFieldError('projectName') && (
                      <div className="invalid-feedback">
                        {getFieldError('projectName')}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="income" className="form-label">Monthly Income (EGP) *</label>
                    <input
                      type="number"
                      className={`form-control ${getFieldError('income') ? 'is-invalid' : ''}`}
                      id="income"
                      name="income"
                      value={formData.income}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                    {getFieldError('income') && (
                      <div className="invalid-feedback">
                        {getFieldError('income')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="familySize" className="form-label">Family Size *</label>
                    <input
                      type="number"
                      className={`form-control ${getFieldError('familySize') ? 'is-invalid' : ''}`}
                      id="familySize"
                      name="familySize"
                      value={formData.familySize}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                    {getFieldError('familySize') && (
                      <div className="invalid-feedback">
                        {getFieldError('familySize')}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="currentHousing" className="form-label">Current Housing *</label>
                    <input
                      type="text"
                      className={`form-control ${getFieldError('currentHousing') ? 'is-invalid' : ''}`}
                      id="currentHousing"
                      name="currentHousing"
                      value={formData.currentHousing}
                      onChange={handleChange}
                      required
                    />
                    {getFieldError('currentHousing') && (
                      <div className="invalid-feedback">
                        {getFieldError('currentHousing')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ 
                      cursor: loading ? 'not-allowed' : 'pointer',
                      zIndex: 1000,
                      pointerEvents: 'auto',
                      position: 'relative'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Submit Application
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/applications')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Applications
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
