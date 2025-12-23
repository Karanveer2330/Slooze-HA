const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const { checkRole } = require("../middleware/roleAuthorization");
const pool = require("../db");

// GET - Get dashboard statistics (Admin/Manager only)
router.get("/stats", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const [restaurants, foodItems, orders, pendingOrders] = await Promise.all([
      pool.query("SELECT COUNT(*) as count FROM restaurants"),
      pool.query("SELECT COUNT(*) as count FROM items"),
      pool.query("SELECT COUNT(*) as count FROM orders"),
      pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'")
    ]);

    res.json({
      totalRestaurants: parseInt(restaurants.rows[0].count),
      totalFoodItems: parseInt(foodItems.rows[0].count),
      totalOrders: parseInt(orders.rows[0].count),
      pendingOrders: parseInt(pendingOrders.rows[0].count)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;



const router = express.Router();
const authorization = require("../middleware/authorization");
const { checkRole } = require("../middleware/roleAuthorization");
const pool = require("../db");

// GET - Get dashboard statistics (Admin/Manager only)
router.get("/stats", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const [restaurants, foodItems, orders, pendingOrders] = await Promise.all([
      pool.query("SELECT COUNT(*) as count FROM restaurants"),
      pool.query("SELECT COUNT(*) as count FROM items"),
      pool.query("SELECT COUNT(*) as count FROM orders"),
      pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'")
    ]);

    res.json({
      totalRestaurants: parseInt(restaurants.rows[0].count),
      totalFoodItems: parseInt(foodItems.rows[0].count),
      totalOrders: parseInt(orders.rows[0].count),
      pendingOrders: parseInt(pendingOrders.rows[0].count)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;




