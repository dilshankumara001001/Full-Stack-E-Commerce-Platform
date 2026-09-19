import { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5 fade-in-up" style={{ maxWidth: '900px' }}>
      <Card className="shadow-lg border-0 overflow-hidden auth-card">
        <Row className="g-0">
          <Col md={5} className="auth-side d-none d-md-flex">
            <div className="auth-side-content text-white p-5 d-flex flex-column justify-content-center">
              <div style={{ fontSize: '4rem' }} className="mb-3">🔐</div>
              <h2 className="fw-bold mb-3">Welcome Back!</h2>
              <p className="opacity-75">
                Sign in to access your orders, cart, and more.
              </p>
              <div className="mt-4 pt-4 border-top border-light border-opacity-25">
                <small className="opacity-75">✨ New here?</small>
                <div className="mt-2">
                  <Button
                    as={Link}
                    to="/register"
                    variant="light"
                    className="fw-bold w-100"
                  >
                    Create Account →
                  </Button>
                </div>
              </div>
            </div>
          </Col>

          <Col md={7}>
            <div className="p-4 p-md-5">
              <h3 className="fw-bold mb-1">Login</h3>
              <p className="text-muted mb-4 small">Enter your credentials to continue</p>

              {error && (
                <Alert variant="danger" className="py-2">
                  <small>⚠️ {error}</small>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
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
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Logging in...
                    </>
                  ) : (
                    '→ Login'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4 d-md-none">
                <small className="text-muted">
                  Don't have an account? <Link to="/register" className="fw-bold text-decoration-none">Register</Link>
                </small>
              </div>

              <div className="text-center mt-4 d-none d-md-block">
                <small className="text-muted">Secure login powered by JWT 🔐</small>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}