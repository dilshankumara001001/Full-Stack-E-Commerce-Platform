import { Container, Table, Button, Alert, Card, Row, Col, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, removeFromCart, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <Container className="mt-5 text-center fade-in-up" style={{ minHeight: '60vh' }}>
        <div style={{ fontSize: '6rem', animation: 'float 3s ease-in-out infinite' }}>🛒</div>
        <h2 className="mt-4 fw-bold">Your cart is empty</h2>
        <p className="text-muted mb-4">Looks like you haven't added anything yet</p>
        <Button as={Link} to="/" variant="primary" size="lg" className="px-5">
          🛍️ Start Shopping
        </Button>
      </Container>
    );
  }

  const shipping = total > 50000 ? 0 : 500;
  const grandTotal = total + shipping;

  return (
    <Container className="mt-4 fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold mb-0">
          🛍️ Your Cart
          <Badge bg="primary" pill className="ms-2" style={{ fontSize: '0.7em' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Badge>
        </h2>
        <Button variant="outline-danger" size="sm" onClick={clearCart}>
          🗑️ Clear Cart
        </Button>
      </div>

      <Row className="g-4">
        {/* ===== CART ITEMS ===== */}
        <Col lg={8}>
          {items.map((i, index) => (
            <Card
              key={i.id}
              className="mb-3 shadow-sm border-0 cart-item-card"
              style={{ animation: `fadeInUp 0.5s ease ${index * 0.05}s backwards` }}
            >
              <Card.Body className="p-3">
                <Row className="align-items-center g-3">
                  <Col xs={3} md={2}>
                    <Link to={`/product/${i.id}`}>
                      <img
                        src={i.image_url}
                        alt={i.name}
                        className="cart-item-img"
                      />
                    </Link>
                  </Col>
                  <Col xs={9} md={4}>
                    <Link
                      to={`/product/${i.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <h6 className="mb-1 fw-bold">{i.name}</h6>
                    </Link>
                    <small className="text-muted d-block">{i.category}</small>
                    <small className="text-primary fw-semibold d-block mt-1">
                      Rs. {Number(i.price).toLocaleString()}
                    </small>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="qty-selector">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="qty-btn"
                        onClick={() => updateQty(i.id, i.qty - 1)}
                      >−</Button>
                      <span className="qty-display">{i.qty}</span>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="qty-btn"
                        onClick={() => updateQty(i.id, i.qty + 1)}
                      >+</Button>
                    </div>
                  </Col>
                  <Col xs={6} md={3} className="text-end">
                    <h6 className="fw-bold mb-2 text-primary">
                      Rs. {(i.price * i.qty).toLocaleString()}
                    </h6>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="btn-remove"
                      onClick={() => removeFromCart(i.id)}
                    >
                      ✕ Remove
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>

        {/* ===== ORDER SUMMARY ===== */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 sticky-summary">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">📋 Order Summary</h5>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="fw-semibold">Rs. {total.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Shipping</span>
                <span className={shipping === 0 ? 'text-success fw-semibold' : 'fw-semibold'}>
                  {shipping === 0 ? '🎉 FREE' : `Rs. ${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <Alert variant="info" className="small py-2 mt-2 mb-3">
                  💡 Rs. {(50000 - total).toLocaleString()} more for FREE shipping!
                </Alert>
              )}
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong className="fs-5">Total</strong>
                <strong className="fs-5 gradient-text">
                  Rs. {grandTotal.toLocaleString()}
                </strong>
              </div>
              <Button
                variant="success"
                size="lg"
                className="w-100 mb-2"
                onClick={handleCheckout}
              >
                ⚡ Checkout Now
              </Button>
              <Button
                as={Link}
                to="/"
                variant="outline-secondary"
                className="w-100"
              >
                ← Continue Shopping
              </Button>

              <div className="trust-badges mt-4 pt-3 border-top">
                <div className="d-flex justify-content-around text-center">
                  <div>
                    <div style={{ fontSize: '1.5rem' }}>🔒</div>
                    <small className="text-muted">Secure</small>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem' }}>🚚</div>
                    <small className="text-muted">Fast</small>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem' }}>↩️</div>
                    <small className="text-muted">Returns</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}