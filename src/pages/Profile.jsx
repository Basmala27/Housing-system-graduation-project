import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        profile: {
            address: '',
            dateOfBirth: '',
            occupation: '',
            familySize: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:5000/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.data.user);
                setFormData({
                    name: data.data.user.name,
                    phone: data.data.user.phone,
                    profile: {
                        address: data.data.user.profile?.address || '',
                        dateOfBirth: data.data.user.profile?.dateOfBirth ? 
                            new Date(data.data.user.profile.dateOfBirth).toISOString().split('T')[0] : '',
                        occupation: data.data.user.profile?.occupation || '',
                        familySize: data.data.user.profile?.familySize || ''
                    }
                });
            } else {
                setError(data.message || 'Failed to fetch profile');
            }
        } catch (err) {
            console.error('Profile fetch error:', err);
            setError('Network error. Please try again.');
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
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Profile updated successfully!');
                setUser(data.data.user);
                setIsEditing(false);
                
                // Update localStorage user data
                localStorage.setItem('user', JSON.stringify(data.data.user));
            } else {
                setError(data.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Profile update error:', err);
            setError('Network error. Please try again.');
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
            <Container className="py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="fw-bold text-primary mb-0">
                                    <i className="bi bi-person-circle me-2"></i>
                                    My Profile
                                </h2>
                                {!isEditing && (
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <i className="bi bi-pencil-square me-2"></i>
                                        Edit Profile
                                    </Button>
                                )}
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={user.email}
                                                disabled
                                                plaintext
                                                readOnly
                                            />
                                            <Form.Text className="text-muted">
                                                Email cannot be changed
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>National ID</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.nationalId}
                                                disabled
                                                plaintext
                                                readOnly
                                            />
                                            <Form.Text className="text-muted">
                                                National ID cannot be changed
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Account Type</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                disabled
                                                plaintext
                                                readOnly
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Account Status</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.isVerified ? 'Verified' : 'Not Verified'}
                                                disabled
                                                plaintext
                                                readOnly
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr className="my-4" />

                                <h5 className="mb-3">Additional Information</h5>

                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="profile.address"
                                        value={formData.profile.address}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Enter your address"
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Date of Birth</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="profile.dateOfBirth"
                                                value={formData.profile.dateOfBirth}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Occupation</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="profile.occupation"
                                                value={formData.profile.occupation}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your occupation"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>Family Size</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="profile.familySize"
                                        value={formData.profile.familySize}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        min="1"
                                        max="20"
                                        placeholder="Number of family members"
                                    />
                                </Form.Group>

                                {isEditing && (
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="primary"
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
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={handleCancel}
                                            disabled={loading}
                                        >
                                            <i className="bi bi-x-circle me-2"></i>
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </Form>

                            <div className="mt-4 pt-4 border-top">
                                <small className="text-muted">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Account created on {new Date(user.createdAt).toLocaleDateString()}
                                    {user.updatedAt !== user.createdAt && (
                                        <> | Last updated on {new Date(user.updatedAt).toLocaleDateString()}</>
                                    )}
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
