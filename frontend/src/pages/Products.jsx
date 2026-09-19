import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API = 'http://localhost:5000/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [sort, setSort] = useState('default');
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`${API}/products`)
      .then(r => {
        setProducts(r.data);
        setFiltered(r.data);
        const cats = [...new Set(r.data.map(p => p.category).filter(Boolean))];
        setCategories(cats);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = [...products];
    if (search) {
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (selectedCat !== 'all') {
      list = list.filter(p => p.category === selectedCat);
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'newest') list.sort((a, b) => b.id - a.id);
    setFiltered(list);
  }, [search, selectedCat, sort, products]);

  if (loading) {
    return (
      <Container className="mt-4">
        <Row>
          {[1, 2, 3, 4].map(i => (
            <Col md={6} lg={3} key={i} className="mb-4">
              <Card className="h-100 shadow-sm">
                <div className="skeleton" style={{ height: '240px' }}></div>
                <Card.Body>
                  <div className="skeleton mb-2" style={{ height: '22px', width: '70%' }}></div>
                  <div className="skeleton mb-2" style={{ height: '15px', width: '50%' }}></div>
                  <div className="skeleton" style={{ height: '42px' }}></div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  return (
    <>
      {/* ===== COMPACT BANNER ===== */}
      <div className="compact-banner text-white text-center">
        <Container>
          <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
            <h2 className="fw-bold mb-0">
              🛒 ShopLK — <span style={{ color: '#fbbf24' }}>Best Online Shopping</span>
            </h2>
            <Badge
              bg="light"
              text="dark"
              className="px-3 py-2"
              style={{ fontSize: '0.75rem', fontWeight: 700 }}
            >
              🎉 Free Shipping over Rs. 50,000
            </Badge>
          </div>
        </Container>
      </div>

      {/* ===== PRODUCTS SECTION ===== */}
      <Container className="mt-4" id="products">
        <h2 className="section-title mb-4">✨ Featured Products</h2>

        {/* FILTERS */}
        <Card className="mb-4 shadow-sm border-0" style={{ background: 'white' }}>
          <Card.Body>
            <Row className="g-3">
              <Col md={5}>
                <Form.Control
                  placeholder="🔍 Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
                  <option value="all">📁 All Categories</option>
                  {categories.map(c => <option key={c} value={c}>📁 {c}</option>)}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="default">⚡ Sort: Default</option>
                  <option value="price-asc">💰 Price: Low → High</option>
                  <option value="price-desc">💎 Price: High → Low</option>
                  <option value="newest">🆕 Newest First</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {filtered.length === 0 && (
          <div className="text-center py-5 fade-in-up">
            <div style={{ fontSize: '4rem' }}>😔</div>
            <h4 className="text-muted mt-3">No products found</h4>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        )}

        <Row>
          {filtered.map((p, index) => (
            <Col md={6} lg={3} key={p.id} className="mb-4">
              <Card className="h-100 product-card border-0">
                <Link to={`/product/${p.id}`} className="text-decoration-none">
                  <div className="product-img-wrap">
                    <Card.Img
                      variant="top"
                      src={p.image_url}
                      className="product-img"
                    />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                      {p.stock <= 5 && p.stock > 0 && (
                        <Badge bg="warning" className="shadow-sm">Only {p.stock} left</Badge>
                      )}
                      {p.stock === 0 && <Badge bg="danger" className="shadow-sm">Out of Stock</Badge>}
                    </div>
                  </div>
                </Link>
                <Card.Body className="d-flex flex-column">
                  <Card.Text className="text-muted small mb-1" style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {p.category?.toUpperCase()}
                  </Card.Text>
                  <Card.Title className="mb-2" style={{ fontSize: '1.05rem' }}>{p.name}</Card.Title>
                  <h5 className="text-primary fw-bold mt-auto mb-3">
                    Rs. {Number(p.price).toLocaleString()}
                  </h5>
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      disabled={p.stock === 0}
                      onClick={() => addToCart(p)}
                    >
                      {p.stock === 0 ? '❌ Out of Stock' : '🛒 Add to Cart'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}