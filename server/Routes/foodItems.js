const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const { checkRole } = require("../middleware/roleAuthorization");
const pool = require("../db");

// GET - Get all food items
router.get("/", async (req, res) => {
  try {
    const foodItems = await pool.query("SELECT * FROM items ORDER BY id");
    res.json(foodItems.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// POST - Create food item (Admin/Manager only)
router.post("/", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { fname, f_ing, f_img, f_price, restaurant_id } = req.body;

    const newFoodItem = await pool.query(
      "INSERT INTO items (fname, f_ing, f_img, f_price, restaurant_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [fname, f_ing, f_img, f_price, restaurant_id || null]
    );

    res.json(newFoodItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// PUT - Update food item (Admin/Manager only)
router.put("/:id", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const { fname, f_ing, f_img, f_price, restaurant_id } = req.body;

    const updatedFoodItem = await pool.query(
      "UPDATE items SET fname = $1, f_ing = $2, f_img = $3, f_price = $4, restaurant_id = $5 WHERE id = $6 RETURNING *",
      [fname, f_ing, f_img, f_price, restaurant_id || null, id]
    );

    if (updatedFoodItem.rows.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    res.json(updatedFoodItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// DELETE - Delete food item (Admin/Manager only)
router.delete("/:id", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFoodItem = await pool.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedFoodItem.rows.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    res.json({ message: "Food item deleted successfully" });
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

// GET - Get all food items
router.get("/", async (req, res) => {
  try {
    const foodItems = await pool.query("SELECT * FROM items ORDER BY id");
    res.json(foodItems.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// POST - Create food item (Admin/Manager only)
router.post("/", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { fname, f_ing, f_img, f_price, restaurant_id } = req.body;

    const newFoodItem = await pool.query(
      "INSERT INTO items (fname, f_ing, f_img, f_price, restaurant_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [fname, f_ing, f_img, f_price, restaurant_id || null]
    );

    res.json(newFoodItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// PUT - Update food item (Admin/Manager only)
router.put("/:id", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const { fname, f_ing, f_img, f_price, restaurant_id } = req.body;

    const updatedFoodItem = await pool.query(
      "UPDATE items SET fname = $1, f_ing = $2, f_img = $3, f_price = $4, restaurant_id = $5 WHERE id = $6 RETURNING *",
      [fname, f_ing, f_img, f_price, restaurant_id || null, id]
    );

    if (updatedFoodItem.rows.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    res.json(updatedFoodItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// DELETE - Delete food item (Admin/Manager only)
router.delete("/:id", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFoodItem = await pool.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedFoodItem.rows.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    res.json({ message: "Food item deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;




