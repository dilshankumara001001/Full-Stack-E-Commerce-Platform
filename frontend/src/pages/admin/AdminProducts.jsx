import { useEffect, useState } from 'react';
import {
  Container, Table, Button, Modal, Form, Alert, Spinner, Badge
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:5000/api';

const emptyForm = { name: '', description: '', price: '', stock: '', image_url: '', category_id: 1 };

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([
      axios.get(`${API}/admin/products`, { headers }),
      axios.get(`${API}/admin/categories`, { headers }),
    ]);
    setProducts(p.data);
    setCategories(c.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      stock: p.stock,
      image_url: p.image_url || '',
      category_id: p.category_id || 1,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/admin/products/${editing}`, form, { headers });
        setMsg('✅ Product updated successfully!');
      } else {
        await axios.post(`${API}/admin/products`, form, { headers });
        setMsg('✅ Product added successfully!');
      }
      setShowModal(false);
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API}/admin/products/${id}`, { headers });
      setMsg('🗑️ Product deleted successfully!');
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="custom-loader mx-auto"></div>
        <p className="text-muted mt-3">Loading products...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4 fade-in-up">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">
            📦 Manage <span className="gradient-text">Products</span>
          </h2>
          <p className="text-muted mb-0 small">
            {products.length} product{products.length !== 1 ? 's' : ''} in your store
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openAdd}
          className="px-4 py-2 btn-add-product"
        >
          <span style={{ fontSize: '1.2rem', marginRight: '5px' }}>+</span>
          Add Product
        </Button>
      </div>

      {msg && (
        <Alert variant="success" className="border-0 shadow-sm" style={{ animation: 'fadeInUp 0.4s ease' }}>
          {msg}
        </Alert>
      )}

      {/* Search Bar */}
      <div className="mb-3">
        <Form.Control
          placeholder="🔍 Search products by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Products Table */}
      <div className="table-wrapper">
        <Table hover responsive className="align-middle admin-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th style={{ width: '100px' }}>Image</th>
              <th>Product</th>
              <th style={{ width: '130px' }}>Category</th>
              <th style={{ width: '140px' }}>Price</th>
              <th style={{ width: '100px' }}>Stock</th>
              <th style={{ width: '180px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-5">
                  <div style={{ fontSize: '3rem' }}>🔍</div>
                  <p className="text-muted mb-0 mt-2">No products found</p>
                </td>
              </tr>
            )}
            {filtered.map(p => (
              <tr key={p.id} className="admin-row">
                <td><span className="id-badge">#{p.id}</span></td>
                <td>
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="admin-product-thumb"
                  />
                </td>
                <td>
                  <div className="fw-semibold">{p.name}</div>
                  <small className="text-muted text-truncate d-block" style={{ maxWidth: '250px' }}>
                    {p.description?.slice(0, 50)}{p.description?.length > 50 ? '...' : ''}
                  </small>
                </td>
                <td>
                  <Badge bg="light" text="dark" className="border">
                    {p.category || 'N/A'}
                  </Badge>
                </td>
                <td>
                  <span className="fw-bold gradient-text">
                    Rs. {Number(p.price).toLocaleString()}
                  </span>
                </td>
                <td>
                  {p.stock > 10 ? (
                    <Badge bg="success" pill>{p.stock} in stock</Badge>
                  ) : p.stock > 0 ? (
                    <Badge bg="warning" pill>Only {p.stock}</Badge>
                  ) : (
                    <Badge bg="danger" pill>Out of stock</Badge>
                  )}
                </td>
                <td className="text-center">
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2 btn-edit"
                    onClick={() => openEdit(p)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="btn-delete"
                    onClick={() => handleDelete(p.id)}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            {editing ? '✏️ Edit Product' : '➕ Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                value={form.name}
                required
                placeholder="e.g. iPhone 15 Pro"
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description}
                placeholder="Brief description of the product..."
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </Form.Group>

            <div className="row">
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>💰 Price (Rs.)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={form.price}
                  required
                  placeholder="0.00"
                  onChange={e => setForm({ ...form, price: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>📊 Stock Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={form.stock}
                  required
                  placeholder="0"
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>🖼️ Image URL</Form.Label>
              <Form.Control
                value={form.image_url}
                placeholder="https://example.com/image.jpg"
                onChange={e => setForm({ ...form, image_url: e.target.value })}
              />
              {form.image_url && (
                <div className="mt-2">
                  <small className="text-muted d-block mb-1">Preview:</small>
                  <img
                    src={form.image_url}
                    alt="Preview"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid #e2e8f0'
                    }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>📁 Category</Form.Label>
              <Form.Select
                value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="px-4">
              {editing ? '✓ Update Product' : '+ Add Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}