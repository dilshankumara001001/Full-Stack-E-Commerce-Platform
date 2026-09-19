import { useEffect, useState } from 'react';
import { Container, Card, Badge, Spinner, Form, Table, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:5000/api';

const statusInfo = {
  pending: { color: 'warning', icon: '⏳', label: 'Pending', gradient: 'status-pending' },
  paid: { color: 'info', icon: '💳', label: 'Paid', gradient: 'status-paid' },
  shipped: { color: 'primary', icon: '🚚', label: 'Shipped', gradient: 'status-shipped' },
  delivered: { color: 'success', icon: '✅', label: 'Delivered', gradient: 'status-delivered' },
};

const statusSteps = ['pending', 'paid', 'shipped', 'delivered'];

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const headers = { Authorization: `Bearer ${token}` };

  const load = () => {
    axios.get(`${API}/admin/orders`, { headers })
      .then(r => setOrders(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/admin/orders/${id}/status`, { status }, { headers });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="custom-loader mx-auto"></div>
        <p className="text-muted mt-3">Loading orders...</p>
      </Container>
    );
  }

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <Container className="mt-4 fade-in-up">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">
            🛒 Manage <span className="gradient-text">Orders</span>
          </h2>
          <p className="text-muted mb-0 small">
            {orders.length} order{orders.length !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <Card className="mini-stat-card stat-gradient-1 text-white border-0">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="opacity-75 d-block" style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Total</small>
                  <h3 className="fw-bold mb-0">{stats.total}</h3>
                </div>
                <span style={{ fontSize: '1.8rem', opacity: 0.4 }}>📦</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="mini-stat-card stat-gradient-2 text-white border-0">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="opacity-75 d-block" style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending</small>
                  <h3 className="fw-bold mb-0">{stats.pending}</h3>
                </div>
                <span style={{ fontSize: '1.8rem', opacity: 0.4 }}>⏳</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="mini-stat-card stat-gradient-3 text-white border-0">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="opacity-75 d-block" style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Shipped</small>
                  <h3 className="fw-bold mb-0">{stats.shipped}</h3>
                </div>
                <span style={{ fontSize: '1.8rem', opacity: 0.4 }}>🚚</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="mini-stat-card stat-gradient-4 text-white border-0">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="opacity-75 d-block" style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Delivered</small>
                  <h3 className="fw-bold mb-0">{stats.delivered}</h3>
                </div>
                <span style={{ fontSize: '1.8rem', opacity: 0.4 }}>✅</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filter Tabs */}
      <div className="filter-tabs mb-4">
        {['all', 'pending', 'paid', 'shipped', 'delivered'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '📋 All' : `${statusInfo[f].icon} ${statusInfo[f].label}`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="border-0 shadow-sm text-center p-5">
          <div style={{ fontSize: '4rem' }}>📭</div>
          <h4 className="fw-bold mt-3">No orders found</h4>
          <p className="text-muted mb-0">
            {filter === 'all' ? 'Orders will appear here when customers place them' : `No ${filter} orders`}
          </p>
        </Card>
      )}

      {/* Orders List */}
      {filtered.map((order, idx) => {
        const info = statusInfo[order.status] || statusInfo.pending;
        const currentStep = statusSteps.indexOf(order.status);

        return (
          <Card
            key={order.id}
            className="mb-3 shadow-sm border-0 admin-order-card"
            style={{ animation: `fadeInUp 0.5s ease ${idx * 0.08}s backwards` }}
          >
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center flex-wrap gap-3 pt-3 pb-0">
              <div className="d-flex align-items-center gap-3">
                <div className={`order-icon-wrap ${info.gradient}`}>
                  {info.icon}
                </div>
                <div>
                  <h6 className="fw-bold mb-0">
                    Order <span className="gradient-text">#{order.id}</span>
                  </h6>
                  <small className="text-muted">
                    {new Date(order.created_at).toLocaleString()}
                  </small>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Badge bg={info.color} pill className="px-3 py-2">
                  {info.icon} {info.label}
                </Badge>
                <Form.Select
                  size="sm"
                  value={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  className="status-select"
                  style={{ width: 'auto' }}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="paid">💳 Paid</option>
                  <option value="shipped">🚚 Shipped</option>
                  <option value="delivered">✅ Delivered</option>
                </Form.Select>
              </div>
            </Card.Header>

            <Card.Body className="pt-3">
              {/* Customer Info */}
              <div className="customer-info mb-3">
                <div className="d-flex align-items-center">
                  <div className="customer-avatar">
                    {order.user_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ms-3">
                    <div className="fw-bold">{order.user_name}</div>
                    <small className="text-muted">📧 {order.user_email}</small>
                  </div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="order-progress mb-3">
                {statusSteps.map((s, i) => {
                  const isActive = i <= currentStep;
                  const isCurrent = i === currentStep;
                  return (
                    <div key={s} className="progress-step">
                      <div
                        className={`progress-dot ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                        title={statusInfo[s].label}
                      >
                        {statusInfo[s].icon}
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`progress-line ${i < currentStep ? 'active' : ''}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Order Items Table */}
              <div className="order-items-wrapper">
                <Table size="sm" borderless className="order-items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style={{ width: '70px' }} className="text-center">Qty</th>
                      <th style={{ width: '120px' }} className="text-end">Price</th>
                      <th style={{ width: '140px' }} className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="fw-semibold">{item.name}</div>
                        </td>
                        <td className="text-center">
                          <Badge bg="light" text="dark" className="border">
                            × {item.quantity}
                          </Badge>
                        </td>
                        <td className="text-end text-muted">
                          Rs. {Number(item.price).toLocaleString()}
                        </td>
                        <td className="text-end fw-semibold">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Total */}
              <div className="order-total-box">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted fw-semibold">Total Amount</span>
                  <h4 className="gradient-text fw-bold mb-0">
                    Rs. {Number(order.total).toLocaleString()}
                  </h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
}