import { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5 fade-in-up" style={{ maxWidth: '900px' }}>
      <Card className="shadow-lg border-0 overflow-hidden auth-card">
        <Row className="g-0">
          {/* LEFT SIDE - Form */}
          <Col md={7} className="order-2 order-md-1">
            <div className="p-4 p-md-5">
              <h3 className="fw-bold mb-1">Create Account</h3>
              <p className="text-muted mb-4 small">Join ShopLK today — it's free!</p>

              {error && (
                <Alert variant="danger" className="py-2">
                  <small>⚠️ {error}</small>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>👤 Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>📧 Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="john@example.com"
                    autoComplete="email"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>🔒 Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                    autoComplete="new-password"
                  />
                  <Form.Text className="text-muted small">
                    Password must be at least 6 characters
                  </Form.Text>
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating account...
                    </>
                  ) : (
                    '✨ Create Account'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <small className="text-muted">
                  Already have an account? <Link to="/login" className="fw-bold text-decoration-none">Login</Link>
                </small>
              </div>
            </div>
          </Col>

          {/* RIGHT SIDE - Branding */}
          <Col md={5} className="auth-side register-side d-none d-md-flex order-1 order-md-2">
            <div className="auth-side-content text-white p-5 d-flex flex-column justify-content-center">
              <div style={{ fontSize: '4rem' }} className="mb-3">✨</div>
              <h2 className="fw-bold mb-3">Join Us!</h2>
              <p className="opacity-75">
  Create an account and start shopping. Free, fast, and safe.
</p>
              <ul className="list-unstyled mt-4">
                <li className="mb-2"><small>✓ Free shipping over Rs. 50,000</small></li>
                <li className="mb-2"><small>✓ Order tracking</small></li>
                <li className="mb-2"><small>✓ Exclusive deals</small></li>
              </ul>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}