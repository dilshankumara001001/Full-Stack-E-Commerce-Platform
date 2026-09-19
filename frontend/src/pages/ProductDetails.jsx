import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API = 'http://localhost:5000/api';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="custom-loader mx-auto"></div>
        <p className="text-muted mt-3">Loading product...</p>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="text-center mt-5">
        <div style={{ fontSize: '4rem' }}>😕</div>
        <h3 className="mt-3">Product not found</h3>
        <Button as={Link} to="/" variant="primary" className="mt-3">
          ← Back to Products
        </Button>
      </Container>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
  };

  return (
    <Container className="mt-4 fade-in-up">
      <Link to="/" className="text-decoration-none mb-3 d-inline-block text-muted back-link">
        ← Back to Products
      </Link>

      <Card className="shadow-sm border-0 overflow-hidden">
        <Card.Body className="p-0">
          <Row className="g-0">
            {/* ===== IMAGE ===== */}
            <Col md={5} className="product-detail-img-col">
              <div className="product-detail-img-wrap">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-detail-img"
                />
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge
                    bg="warning"
                    className="position-absolute shadow-sm"
                    style={{ top: '20px', right: '20px', fontSize: '0.85rem', padding: '8px 14px' }}
                  >
                    ⚠️ Only {product.stock} left
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute shadow-sm"
                    style={{ top: '20px', right: '20px', fontSize: '0.85rem', padding: '8px 14px' }}
                  >
                    ❌ Out of Stock
                  </Badge>
                )}
              </div>
            </Col>

            {/* ===== DETAILS ===== */}
            <Col md={7}>
              <div className="p-4 p-md-5 d-flex flex-column h-100">
                <div className="mb-2">
                  <Badge
                    bg="light"
                    text="dark"
                    className="border"
                    style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}
                  >
                    {product.category?.toUpperCase()}
                  </Badge>
                </div>

                <h1 className="display-6 fw-bold mb-3">{product.name}</h1>

                <div className="d-flex align-items-center mb-3">
                  <div className="text-warning" style={{ fontSize: '1.1rem' }}>
                    ⭐⭐⭐⭐⭐
                  </div>
                  <span className="text-muted ms-2 small">(4.9 · 127 reviews)</span>
                </div>

                <p className="text-muted mb-4" style={{ lineHeight: 1.7 }}>
                  {product.description || 'No description available for this product.'}
                </p>

                <div className="price-box mb-4">
                  <h2 className="gradient-text fw-bold mb-0" style={{ fontSize: '2.2rem' }}>
                    Rs. {Number(product.price).toLocaleString()}
                  </h2>
                </div>

                <div className="stock-info mb-4">
                  {product.stock > 0 ? (
                    <span className="text-success fw-semibold">
                      ✓ In Stock — {product.stock} available
                    </span>
                  ) : (
                    <span className="text-danger fw-semibold">✗ Currently Unavailable</span>
                  )}
                </div>

                {product.stock > 0 && (
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <span className="fw-bold">Quantity:</span>
                    <div className="qty-selector">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="qty-btn"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                      >−</Button>
                      <span className="qty-display">{qty}</span>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="qty-btn"
                        onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      >+</Button>
                    </div>
                  </div>
                )}

                <div className="d-flex gap-3 flex-wrap mt-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                    className="flex-grow-1"
                  >
                    🛒 Add to Cart
                  </Button>
                  <Button as={Link} to="/cart" variant="success" size="lg" className="flex-grow-1">
                    ⚡ Buy Now
                  </Button>
                </div>

                <div className="features mt-4 pt-3 border-top">
                  <Row className="text-center g-3">
                    <Col xs={4}>
                      <div className="feature-item">
                        <div style={{ fontSize: '1.8rem' }}>🚚</div>
                        <small className="text-muted d-block mt-1">Fast Delivery</small>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="feature-item">
                        <div style={{ fontSize: '1.8rem' }}>🛡️</div>
                        <small className="text-muted d-block mt-1">1 Year Warranty</small>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="feature-item">
                        <div style={{ fontSize: '1.8rem' }}>↩️</div>
                        <small className="text-muted d-block mt-1">Easy Returns</small>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="text-center mt-5 mb-5">
        <Button as={Link} to="/" variant="outline-primary" size="lg" className="px-4">
          ← Continue Shopping
        </Button>
      </div>
    </Container>
  );
}