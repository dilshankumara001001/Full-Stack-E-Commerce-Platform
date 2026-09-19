import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => setStats(r.data))
      .catch(err => console.error(err));
  }, [token]);

  if (!stats) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;

  const cards = [
    { title: 'Products', value: stats.totalProducts, color: 'primary', icon: '📦', link: '/admin/products' },
    { title: 'Orders', value: stats.totalOrders, color: 'warning', icon: '🛒', link: '/admin/orders' },
    { title: 'Users', value: stats.totalUsers, color: 'info', icon: '👥', link: null },
    { title: 'Sales', value: `Rs. ${Number(stats.totalSales).toFixed(2)}`, color: 'success', icon: '💰', link: null },
  ];

  return (
    <Container className="mt-4">
      <h2 className="mb-4">👨‍💼 Admin Dashboard</h2>
      <Row>
        {cards.map((c, i) => (
          <Col md={6} lg={3} key={i} className="mb-3">
            <Card
              className={`shadow-sm text-white bg-${c.color} h-100`}
              as={c.link ? Link : 'div'}
              to={c.link || undefined}
              style={{ textDecoration: 'none' }}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Subtitle className="mb-2 opacity-75">{c.title}</Card.Subtitle>
                    <h3 className="mb-0">{c.value}</h3>
                  </div>
                  <div style={{ fontSize: '2.5rem' }}>{c.icon}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}