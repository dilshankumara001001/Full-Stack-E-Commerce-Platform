import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function Dashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => setStats(r.data))
      .catch(err => console.error(err));
  }, [token]);

  if (!stats) {
    return (
      <Container className="text-center mt-5">
        <div className="custom-loader mx-auto"></div>
        <p className="text-muted mt-3">Loading dashboard...</p>
      </Container>
    );
  }

  const cards = [
    {
      title: 'Products',
      value: stats.totalProducts,
      gradient: 'stat-gradient-1',
      icon: '📦',
      link: '/admin/products',
      subtitle: 'Total items',
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      gradient: 'stat-gradient-2',
      icon: '🛒',
      link: '/admin/orders',
      subtitle: 'All orders',
    },
    {
      title: 'Users',
      value: stats.totalUsers,
      gradient: 'stat-gradient-3',
      icon: '👥',
      link: null,
      subtitle: 'Registered',
    },
    {
      title: 'Sales',
      value: `Rs. ${Number(stats.totalSales).toLocaleString()}`,
      gradient: 'stat-gradient-4',
      icon: '💰',
      link: null,
      subtitle: 'Total revenue',
    },
  ];

  return (
    <Container className="mt-4 fade-in-up">
      {/* Welcome Header */}
      <div className="admin-welcome mb-5">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <div className="admin-avatar">
            <span style={{ fontSize: '2rem' }}>👨‍💼</span>
          </div>
          <div>
            <h2 className="fw-bold mb-1">
              Welcome back, <span className="gradient-text">{user?.name}</span>! 👋
            </h2>
            <p className="text-muted mb-0">Here's what's happening in your store today</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        {cards.map((c, i) => {
          const CardContent = (
            <Card
              className={`stat-card ${c.gradient} text-white border-0 h-100`}
              style={{ animation: `fadeInUp 0.5s ease ${i * 0.1}s backwards` }}
            >
              <Card.Body className="p-4 position-relative">
                <div className="stat-icon-wrap">
                  <span style={{ fontSize: '3rem' }}>{c.icon}</span>
                </div>
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <small className="opacity-75 d-block mb-2" style={{ letterSpacing: '0.05em', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    {c.title}
                  </small>
                  <h2 className="fw-bold mb-1" style={{ fontSize: '1.75rem' }}>{c.value}</h2>
                  <small className="opacity-75" style={{ fontSize: '0.75rem' }}>{c.subtitle}</small>
                </div>
                {c.link && (
                  <div className="stat-arrow">→</div>
                )}
              </Card.Body>
            </Card>
          );

          return (
            <Col md={6} lg={3} key={i}>
              {c.link ? (
                <Link to={c.link} className="text-decoration-none d-block h-100">
                  {CardContent}
                </Link>
              ) : (
                CardContent
              )}
            </Col>
          );
        })}
      </Row>

      {/* Quick Actions */}
      <h5 className="fw-bold mb-3">⚡ Quick Actions</h5>
      <Row className="g-3">
        <Col md={4}>
          <Link to="/admin/products" className="text-decoration-none">
            <Card className="quick-action-card border-0 h-100">
              <Card.Body className="d-flex align-items-center p-4">
                <div className="quick-icon quick-icon-1">📦</div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1 text-dark">Manage Products</h6>
                  <small className="text-muted">Add, edit or remove items</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/admin/orders" className="text-decoration-none">
            <Card className="quick-action-card border-0 h-100">
              <Card.Body className="d-flex align-items-center p-4">
                <div className="quick-icon quick-icon-2">🛒</div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1 text-dark">View Orders</h6>
                  <small className="text-muted">Track and update status</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/" className="text-decoration-none">
            <Card className="quick-action-card border-0 h-100">
              <Card.Body className="d-flex align-items-center p-4">
                <div className="quick-icon quick-icon-3">🏠</div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1 text-dark">Visit Store</h6>
                  <small className="text-muted">See the customer view</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}