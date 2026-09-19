import { useEffect, useState } from 'react';
import { Container, Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

const statusInfo = {
  pending: { color: 'warning', icon: '⏳', label: 'Pending' },
  paid: { color: 'info', icon: '💳', label: 'Paid' },
  shipped: { color: 'primary', icon: '🚚', label: 'Shipped' },
  delivered: { color: 'success', icon: '✅', label: 'Delivered' },
};

export default function Orders() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    axios.get(`${API}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => setOrders(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user, token]);

  if (!user) {
    return (
      <Container className="mt-5 text-center fade-in-up" style={{ maxWidth: '600px' }}>
        <Card className="shadow-sm border-0 p-5">
          <div style={{ fontSize: '4rem' }}>🔐</div>
          <h3 className="mt-3 fw-bold">Login Required</h3>
          <Button as={Link} to="/login" variant="primary" size="lg" className="mt-3">
            → Login
          </Button>
        </Card>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="custom-loader mx-auto"></div>
        <p className="text-muted mt-3">Loading orders...</p>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="mt-5 text-center fade-in-up" style={{ maxWidth: '600px' }}>
        <Card className="shadow-sm border-0 p-5">
          <div style={{ fontSize: '5rem', animation: 'float 3s ease infinite' }}>📦</div>
          <h3 className="mt-3 fw-bold">No Orders Yet</h3>
          <p className="text-muted">ඔයා තාම order කරලා නෑ. Shopping පටන් ගන්න!</p>
          <Button as={Link} to="/" variant="primary" size="lg" className="mt-3 px-5">
            🛍️ Start Shopping
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-4 fade-in-up" style={{ maxWidth: '900px' }}>
      <h2 className="fw-bold mb-4">📦 My Orders</h2>

      {orders.map((order, idx) => {
        const info = statusInfo[order.status] || statusInfo.pending;
        return (
          <Card
            key={order.id}
            className="mb-3 shadow-sm border-0 order-card"
            style={{ animation: `fadeInUp 0.5s ease ${idx * 0.08}s backwards` }}
          >
            <Card.Header
              className="bg-white border-0 d-flex justify-content-between align-items-center flex-wrap gap-2 pt-3"
            >
              <div>
                <h6 className="fw-bold mb-0">
                  Order <span className="gradient-text">#{order.id}</span>
                </h6>
                <small className="text-muted">
                  {new Date(order.created_at).toLocaleString()}
                </small>
              </div>
              <Badge
                bg={info.color}
                pill
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                {info.icon} {info.label}
              </Badge>
            </Card.Header>

            <Card.Body className="pt-0">
              {order.items.map(item => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between align-items-center py-2 order-item"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="order-item-img"
                    />
                    <div className="ms-3">
                      <div className="fw-semibold">{item.name}</div>
                      <small className="text-muted">
                        Rs. {Number(item.price).toLocaleString()} × {item.quantity}
                      </small>
                    </div>
                  </div>
                  <div className="fw-bold text-primary">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}

              <hr className="my-3" />
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3">
                  {['pending', 'paid', 'shipped', 'delivered'].map((s, i) => {
                    const orderIdx = ['pending', 'paid', 'shipped', 'delivered'].indexOf(order.status);
                    const isActive = i <= orderIdx;
                    return (
                      <div key={s} className="d-flex flex-column align-items-center">
                        <div className={`progress-dot ${isActive ? 'active' : ''}`}>
                          {statusInfo[s].icon}
                        </div>
                        <small className={`progress-label ${isActive ? 'active' : ''}`}>
                          {statusInfo[s].label}
                        </small>
                      </div>
                    );
                  })}
                </div>
                <div className="text-end">
                  <small className="text-muted d-block">Total</small>
                  <h5 className="fw-bold gradient-text mb-0">
                    Rs. {Number(order.total).toLocaleString()}
                  </h5>
                </div>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
}