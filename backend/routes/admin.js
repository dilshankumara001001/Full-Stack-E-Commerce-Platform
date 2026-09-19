const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// ඔක්කොම admin routes වලට auth + admin check
router.use(auth, admin);

// ===== DASHBOARD STATS =====
router.get('/stats', async (req, res) => {
  try {
    const [[{ totalProducts }]] = await db.query('SELECT COUNT(*) AS totalProducts FROM products');
    const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalSales }]] = await db.query(
      "SELECT COALESCE(SUM(total), 0) AS totalSales FROM orders WHERE status != 'pending'"
    );
    res.json({ totalProducts, totalOrders, totalUsers, totalSales });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== PRODUCTS CRUD =====
router.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.name AS category 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/products', async (req, res) => {
  const { name, description, price, stock, image_url, category_id } = req.body;
  try {
    const [r] = await db.query(
      'INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES (?,?,?,?,?,?)',
      [name, description, price, stock, image_url, category_id]
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/products/:id', async (req, res) => {
  const { name, description, price, stock, image_url, category_id } = req.body;
  try {
    await db.query(
      'UPDATE products SET name=?, description=?, price=?, stock=?, image_url=?, category_id=? WHERE id=?',
      [name, description, price, stock, image_url, category_id, req.params.id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== CATEGORIES =====
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== ORDERS =====
router.get('/orders', async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.name AS user_name, u.email AS user_email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'paid', 'shipped', 'delivered'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;