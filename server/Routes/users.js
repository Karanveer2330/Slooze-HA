const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const { checkRole } = require("../middleware/roleAuthorization");
const pool = require("../db");

// GET - Get all users (Admin only)
router.get("/", authorization, checkRole('admin'), async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT user_id, user_name, user_email, user_role, country FROM logins ORDER BY user_id"
    );
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// PUT - Update user role (Admin only)
router.put("/:user_id/role", authorization, checkRole('admin'), async (req, res) => {
  try {
    const { user_id } = req.params;
    const { user_role } = req.body;

    const validRoles = ['admin', 'manager', 'member'];
    if (!validRoles.includes(user_role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const updatedUser = await pool.query(
      "UPDATE logins SET user_role = $1 WHERE user_id = $2 RETURNING user_id, user_name, user_email, user_role, country",
      [user_role, user_id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser.rows[0]);
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

// GET - Get all users (Admin only)
router.get("/", authorization, checkRole('admin'), async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT user_id, user_name, user_email, user_role, country FROM logins ORDER BY user_id"
    );
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// PUT - Update user role (Admin only)
router.put("/:user_id/role", authorization, checkRole('admin'), async (req, res) => {
  try {
    const { user_id } = req.params;
    const { user_role } = req.body;

    const validRoles = ['admin', 'manager', 'member'];
    if (!validRoles.includes(user_role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const updatedUser = await pool.query(
      "UPDATE logins SET user_role = $1 WHERE user_id = $2 RETURNING user_id, user_name, user_email, user_role, country",
      [user_role, user_id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;




