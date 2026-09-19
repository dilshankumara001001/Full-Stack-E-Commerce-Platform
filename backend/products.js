const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.name AS category 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;