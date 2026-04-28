import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dataService from '../services/dataService';

const Profile = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        role: '',
        profile: {
            address: '',
            dateOfBirth: '',
            occupation: '',
            familySize: '',
            monthlyIncome: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                email: user.email || '',
                role: user.role || '',
                profile: {
                    address: user.profile?.address || '',
                    dateOfBirth: user.profile?.dateOfBirth ? 
                        new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : '',
                    occupation: user.profile?.occupation || '',
                    familySize: user.profile?.familySize || '',
                    monthlyIncome: user.profile?.monthlyIncome || ''
                }
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Update user in dataService
            const updatedUser = dataService.updateUser(user.id, {
                name: formData.name,
                phone: formData.phone,
                profile: formData.profile
            });

            if (updatedUser) {
                // Update auth context
                updateUser(updatedUser);
                setSuccess('Profile updated successfully!');
                setIsEditing(false);
            } else {
                setError('Failed to update profile');
            }
        } catch (err) {
            setError('Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('profile.')) {
            const profileField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [profileField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Update user in dataService
            const updatedUser = dataService.updateUser(user.id, {
                name: formData.name,
                phone: formData.phone,
                profile: formData.profile
            });

            if (updatedUser) {
                // Update auth context
                updateUser(updatedUser);
                setSuccess('Profile updated successfully!');
                setIsEditing(false);
            } else {
                setError('Failed to update profile');
            }
        } catch (err) {
            setError('Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form to original user data
        if (user) {
            setFormData({
                name: user.name,
                phone: user.phone,
                profile: {
                    address: user.profile?.address || '',
                    dateOfBirth: user.profile?.dateOfBirth ? 
                        new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : '',
                    occupation: user.profile?.occupation || '',
                    familySize: user.profile?.familySize || ''
                }
            });
        }
    };

    if (!user) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="fw-bold text-primary mb-0">
                                    <i className="bi bi-person-circle me-2"></i>
                                    My Profile
                                </h2>
                                {!isEditing && (
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <i className="bi bi-pencil-square me-2"></i>
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                value={user.email}
                                                disabled
                                                readOnly
                                            />
                                            <small className="text-muted">Email cannot be changed</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="phone" className="form-label">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="nationalId" className="form-label">National ID</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nationalId"
                                                value={user.nationalId}
                                                disabled
                                                readOnly
                                            />
                                            <small className="text-muted">National ID cannot be changed</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Account Type</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                disabled
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Account Status</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={user.isVerified ? 'Verified' : 'Not Verified'}
                                                disabled
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <h5 className="mb-3">Additional Information</h5>

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="profile.address"
                                        value={formData.profile.address}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Enter your address"
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="dateOfBirth"
                                                name="profile.dateOfBirth"
                                                value={formData.profile.dateOfBirth}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="occupation" className="form-label">Occupation</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="occupation"
                                                name="profile.occupation"
                                                value={formData.profile.occupation}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="familySize" className="form-label">Family Size</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="familySize"
                                        name="profile.familySize"
                                        value={formData.profile.familySize}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        min="1"
                                        max="20"
                                        placeholder="Number of family members"
                                    />
                                </div>

                                {isEditing && (
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-primary"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={handleCancel}
                                            disabled={loading}
                                        >
                                            <i className="bi bi-x-circle me-2"></i>
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>

                            <div className="mt-4 pt-4 border-top">
                                <small className="text-muted">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Account created on {new Date(user.createdAt).toLocaleDateString()}
                                    {user.updatedAt !== user.createdAt && (
                                        <> | Last updated on {new Date(user.updatedAt).toLocaleDateString()}</>
                                    )}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
