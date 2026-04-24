import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [token, setToken] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isResetting, setIsResetting] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Password reset token generated!');
                // In development, show the token
                if (data.data?.resetToken) {
                    setToken(data.data.resetToken);
                    setShowToken(true);
                }
                setIsResetting(true);
            } else {
                setError(data.message || 'Failed to generate reset token');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!token.trim()) {
            setError('Reset token is required');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token.trim(),
                    password: newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Password reset successful! Redirecting to login...');
                
                // Store new token and user data
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary">
                                    <i className="bi bi-key-fill me-2"></i>
                                    {isResetting ? 'Reset Password' : 'Forgot Password'}
                                </h2>
                                <p className="text-muted">
                                    {isResetting 
                                        ? 'Enter your reset token and new password'
                                        : 'Enter your email to receive a password reset token'
                                    }
                                </p>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            {!isResetting ? (
                                <Form onSubmit={handleForgotPassword}>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your registered email"
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                            We'll send a reset token to this email
                                        </Form.Text>
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Sending Token...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-envelope-fill me-2"></i>
                                                Send Reset Token
                                            </>
                                        )}
                                    </Button>
                                </Form>
                            ) : (
                                <Form onSubmit={handleResetPassword}>
                                    {showToken && (
                                        <Alert variant="info">
                                            <strong>Development Mode:</strong> Your reset token is: <code>{token}</code>
                                            <br />
                                            <small>In production, this would be sent to your email.</small>
                                        </Alert>
                                    )}

                                    <Form.Group className="mb-3">
                                        <Form.Label>Reset Token</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value)}
                                            placeholder="Enter the reset token"
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                            Check your email for the reset token
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter your new password"
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                            Password must be at least 6 characters long
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm your new password"
                                            required
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Resetting Password...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle-fill me-2"></i>
                                                Reset Password
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="link"
                                        className="w-100 mt-2"
                                        onClick={() => {
                                            setIsResetting(false);
                                            setEmail('');
                                            setToken('');
                                            setNewPassword('');
                                            setConfirmPassword('');
                                            setError('');
                                            setSuccess('');
                                        }}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Email Entry
                                    </Button>
                                </Form>
                            )}

                            <div className="text-center mt-4">
                                <p className="mb-0">
                                    Remember your password?{' '}
                                    <Link to="/login" className="text-primary text-decoration-none">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;
