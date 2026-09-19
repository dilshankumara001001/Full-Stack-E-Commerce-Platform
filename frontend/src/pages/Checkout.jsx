import { useState } from 'react';
import { Container, Card, Button, Alert, Form, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  if (!user) {
    return (
      <Container className="mt-5 text-center fade-in-up" style={{ maxWidth: '600px' }}>
        <Card className="shadow-sm border-0 p-5">
          <div style={{ fontSize: '4rem' }}>🔐</div>
          <h3 className="mt-3 fw-bold">Login Required</h3>
          <p className="text-muted">Order කරන්න කලින් login වෙන්න ඕන</p>
          <Button as={Link} to="/login" variant="primary" size="lg" className="mt-3">
            → Login Now
          </Button>
        </Card>
      </Container>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <Container className="mt-5 text-center fade-in-up" style={{ maxWidth: '600px' }}>
        <Card className="shadow-sm border-0 p-5">
          <div style={{ fontSize: '4rem' }}>🛒</div>
          <h3 className="mt-3 fw-bold">Cart is empty</h3>
          <Button as={Link} to="/" variant="primary" size="lg" className="mt-3">
            🛍️ Shop Now
          </Button>
        </Card>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="mt-5 fade-in-up" style={{ maxWidth: '600px' }}>
        <Card className="shadow-lg border-0 p-5 text-center success-card">
          <div
            className="success-checkmark"
            style={{ fontSize: '5rem', animation: 'pulse 1s ease infinite' }}
          >
            ✅
          </div>
          <h2 className="fw-bold mt-3">Order Placed!</h2>
          <p className="text-muted mb-4">ඔයාගේ order එක සාර්ථකව ලැබුණා</p>
          <div className="order-id-box mb-4">
            <small className="text-muted d-block">Order ID</small>
            <h3 className="gradient-text fw-bold mb-0">#{orderId}</h3>
          </div>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Button as={Link} to="/orders" variant="success" size="lg">
              📦 View Orders
            </Button>
            <Button as={Link} to="/" variant="outline-primary" size="lg">
              Continue Shopping
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await axios.post(
        `${API}/orders`,
        { items, address, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrderId(r.data.orderId);
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const shipping = total > 50000 ? 0 : 500;
  const grandTotal = total + shipping;

  return (
    <Container className="mt-4 fade-in-up" style={{ maxWidth: '1000px' }}>
      <h2 className="fw-bold mb-4">
        📦 Checkout
        <Badge bg="primary" pill className="ms-2" style={{ fontSize: '0.4em' }}>
          Step 1 of 1
        </Badge>
      </h2>

      {error && <Alert variant="danger">⚠️ {error}</Alert>}

      <Row className="g-4">
        {/* ===== SHIPPING FORM ===== */}
        <Col lg={7}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="step-badge">1</div>
                <h5 className="fw-bold mb-0 ms-3">Shipping Details</h5>
              </div>

              <Form onSubmit={handlePlaceOrder}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>👤 Name</Form.Label>
                      <Form.Control value={user.name} disabled />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>📧 Email</Form.Label>
                      <Form.Control value={user.email} disabled />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>📞 Phone</Form.Label>
                  <Form.Control
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="07X XXX XXXX"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>📍 Delivery Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="No, Street, City, Postal Code"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>💳 Payment Method</Form.Label>
                  <div className="payment-options">
                    <div className="payment-option active">
                      <div className="d-flex align-items-center">
                        <span style={{ fontSize: '1.5rem' }}>💵</span>
                        <div className="ms-3">
                          <strong className="d-block">Cash on Delivery</strong>
                          <small className="text-muted">Pay when you receive</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Placing Order...
                    </>
                  ) : (
                    `✓ Place Order — Rs. ${grandTotal.toLocaleString()}`
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* ===== ORDER SUMMARY ===== */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 sticky-summary">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">🛒 Order Summary</h5>
              <hr />

              <div className="summary-items mb-3">
                {items.map(i => (
                  <div key={i.id} className="d-flex align-items-center mb-3">
                    <img
                      src={i.image_url}
                      alt={i.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <div className="fw-semibold small">{i.name}</div>
                      <small className="text-muted">Qty: {i.qty}</small>
                    </div>
                    <div className="fw-semibold small">
                      Rs. {(i.price * i.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Shipping</span>
                <span className={shipping === 0 ? 'text-success fw-semibold' : ''}>
                  {shipping === 0 ? '🎉 FREE' : `Rs. ${shipping}`}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong className="fs-5">Total</strong>
                <strong className="fs-5 gradient-text">
                  Rs. {grandTotal.toLocaleString()}
                </strong>
              </div>

              <div className="secure-badge mt-4 text-center">
                <small className="text-muted">
                  🔒 Your information is secure & encrypted
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}