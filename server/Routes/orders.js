const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const { checkRole } = require("../middleware/roleAuthorization");
const pool = require("../db");

router.get("/", authorization, async (req, res) => {
  try {
    const userId = req.user.user;
    const userRole = (req.user.role || 'member').toLowerCase();
    const userCountry = req.user.country || 'India';

    let query;
    let params;

    if (userRole === 'admin') {
      query = `
        SELECT o.*, l.user_name, l.user_email, l.country as user_country
        FROM orders o 
        LEFT JOIN logins l ON o.user_id = l.user_id 
        ORDER BY l.country, o.created_at DESC
      `;
      params = [];
    } 
    else if (userRole === 'manager') {
      const managerInfo = await pool.query(
        "SELECT country FROM logins WHERE user_id = $1",
        [userId]
      );
      
      const dbCountry = managerInfo.rows[0]?.country;
      
      if (!dbCountry) {
        return res.status(500).json({ error: "Manager country not set in database" });
      }
      
      query = `
        SELECT o.*, l.user_name, l.user_email, l.country as user_country
        FROM orders o 
        INNER JOIN logins l ON o.user_id = l.user_id 
        WHERE l.country = $1
        ORDER BY o.created_at DESC
      `;
      params = [dbCountry];
    } 
    else {
      query = `
        SELECT o.*, l.user_name, l.user_email, l.country as user_country
        FROM orders o 
        LEFT JOIN logins l ON o.user_id = l.user_id 
        WHERE o.user_id = $1 
        ORDER BY o.created_at DESC
      `;
      params = [userId];
    }

    const orders = await pool.query(query, params);
    res.json(orders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.post("/", authorization, checkRole('admin', 'manager', 'member'), async (req, res) => {
  try {
    const userId = req.user.user;
    const { restaurant_id, items, total_amount, payment_method_id } = req.body;

    const newOrder = await pool.query(
      "INSERT INTO orders (user_id, restaurant_id, items, total_amount, status, payment_method_id) VALUES ($1, $2, $3, $4, 'pending', $5) RETURNING *",
      [userId, restaurant_id, JSON.stringify(items), total_amount, payment_method_id || null]
    );

    res.json(newOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.post("/checkout", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { order_id } = req.body;

    const order = await pool.query("SELECT * FROM orders WHERE order_id = $1", [order_id]);

    if (order.rows.length === 0) {
      return res.status(404).json("Order not found");
    }

    const updatedOrder = await pool.query(
      "UPDATE orders SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE order_id = $1 RETURNING *",
      [order_id]
    );

    res.json(updatedOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.put("/:order_id/cancel", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { order_id } = req.params;
    const userId = req.user.user;
    const userRole = req.user.role;

    const order = await pool.query("SELECT * FROM orders WHERE order_id = $1", [order_id]);

    if (order.rows.length === 0) {
      return res.status(404).json("Order not found");
    }

    if (userRole !== 'admin' && order.rows[0].user_id !== userId) {
      return res.status(403).json("Access denied");
    }

    const updatedOrder = await pool.query(
      "UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE order_id = $1 RETURNING *",
      [order_id]
    );

    res.json(updatedOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// PUT - Update order status (Admin/Manager only)
router.put("/:order_id/status", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    // Allow pending, served, delivered, and cancelled
    const validStatuses = ['pending', 'served', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updatedOrder = await pool.query(
      "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2 RETURNING *",
      [status, order_id]
    );

    if (updatedOrder.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;


const authorization = require("../middleware/authorization");
const { checkRole } = require("../middleware/roleAuthorization");
const pool = require("../db");

router.get("/", authorization, async (req, res) => {
  try {
    const userId = req.user.user;
    const userRole = (req.user.role || 'member').toLowerCase();
    const userCountry = req.user.country || 'India';

    let query;
    let params;

    if (userRole === 'admin') {
      query = `
        SELECT o.*, l.user_name, l.user_email, l.country as user_country
        FROM orders o 
        LEFT JOIN logins l ON o.user_id = l.user_id 
        ORDER BY l.country, o.created_at DESC
      `;
      params = [];
    } 
    else if (userRole === 'manager') {
      const managerInfo = await pool.query(
        "SELECT country FROM logins WHERE user_id = $1",
        [userId]
      );
      
      const dbCountry = managerInfo.rows[0]?.country;
      
      if (!dbCountry) {
        return res.status(500).json({ error: "Manager country not set in database" });
      }
      
      query = `
        SELECT o.*, l.user_name, l.user_email, l.country as user_country
        FROM orders o 
        INNER JOIN logins l ON o.user_id = l.user_id 
        WHERE l.country = $1
        ORDER BY o.created_at DESC
      `;
      params = [dbCountry];
    } 
    else {
      query = `
        SELECT o.*, l.user_name, l.user_email, l.country as user_country
        FROM orders o 
        LEFT JOIN logins l ON o.user_id = l.user_id 
        WHERE o.user_id = $1 
        ORDER BY o.created_at DESC
      `;
      params = [userId];
    }

    const orders = await pool.query(query, params);
    res.json(orders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.post("/", authorization, checkRole('admin', 'manager', 'member'), async (req, res) => {
  try {
    const userId = req.user.user;
    const { restaurant_id, items, total_amount, payment_method_id } = req.body;

    const newOrder = await pool.query(
      "INSERT INTO orders (user_id, restaurant_id, items, total_amount, status, payment_method_id) VALUES ($1, $2, $3, $4, 'pending', $5) RETURNING *",
      [userId, restaurant_id, JSON.stringify(items), total_amount, payment_method_id || null]
    );

    res.json(newOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.post("/checkout", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { order_id } = req.body;

    const order = await pool.query("SELECT * FROM orders WHERE order_id = $1", [order_id]);

    if (order.rows.length === 0) {
      return res.status(404).json("Order not found");
    }

    const updatedOrder = await pool.query(
      "UPDATE orders SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE order_id = $1 RETURNING *",
      [order_id]
    );

    res.json(updatedOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.put("/:order_id/cancel", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { order_id } = req.params;
    const userId = req.user.user;
    const userRole = req.user.role;

    const order = await pool.query("SELECT * FROM orders WHERE order_id = $1", [order_id]);

    if (order.rows.length === 0) {
      return res.status(404).json("Order not found");
    }

    if (userRole !== 'admin' && order.rows[0].user_id !== userId) {
      return res.status(403).json("Access denied");
    }

    const updatedOrder = await pool.query(
      "UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE order_id = $1 RETURNING *",
      [order_id]
    );

    res.json(updatedOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// PUT - Update order status (Admin/Manager only)
router.put("/:order_id/status", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    // Allow pending, served, delivered, and cancelled
    const validStatuses = ['pending', 'served', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updatedOrder = await pool.query(
      "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2 RETURNING *",
      [status, order_id]
    );

    if (updatedOrder.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;

