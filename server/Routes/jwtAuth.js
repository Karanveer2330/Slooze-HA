const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validinfo = require("../middleware/validinfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");

router.post("/register", validinfo, async (req, res) => {
  const { user_name, user_email, user_password, user_lname, adr, adr1, city, state, zip, country } = req.body;

  try {
    const user = await pool.query("SELECT * FROM logins WHERE user_email = $1", [user_email]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exists!");
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(user_password, salt);

    const userCountry = country || 'India';
    const userRole = 'member';

    let newUser;
    
    // Check if user_role and country columns exist, if not use basic insert
    try {
      newUser = await pool.query(
        "INSERT INTO logins (user_name, user_email, user_password, user_lname, adr, adr1, city, state, zip, user_role, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING user_id, user_name, user_email, user_role, country",
        [user_name, user_email, bcryptPassword, user_lname, adr, adr1, city, state, zip, userRole, userCountry]
      );
    } catch (columnError) {
      // If columns don't exist, try without them (for backward compatibility)
      if (columnError.message.includes('column') && columnError.message.includes('does not exist')) {
        newUser = await pool.query(
          "INSERT INTO logins (user_name, user_email, user_password, user_lname, adr, adr1, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id, user_name, user_email",
          [user_name, user_email, bcryptPassword, user_lname, adr, adr1, city, state, zip]
        );
        // Add default role and country
        newUser.rows[0].user_role = 'member';
        newUser.rows[0].country = 'India';
      } else {
        throw columnError;
      }
    }

    const token = jwtGenerator(newUser.rows[0].user_id, newUser.rows[0].user_role, newUser.rows[0].country);

    res.json({ 
      token,
      user: {
        id: newUser.rows[0].user_id,
        name: newUser.rows[0].user_name,
        email: newUser.rows[0].user_email,
        role: newUser.rows[0].user_role,
        country: newUser.rows[0].country
      }
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.post("/login", validinfo, async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM logins WHERE user_email = $1", [user_email]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid credentials");
    }

    const validPassword = await bcrypt.compare(user_password, user.rows[0].user_password);

    if (!validPassword) {
      return res.status(401).json("Invalid credentials");
    }

    const userRole = (user.rows[0].user_role || 'member').toLowerCase();
    const userCountry = user.rows[0].country || 'India';

    const token = jwtGenerator(user.rows[0].user_id, userRole, userCountry);
    
    return res.json({ 
      token,
      user: {
        id: user.rows[0].user_id,
        name: user.rows[0].user_name,
        email: user.rows[0].user_email,
        role: userRole,
        country: userCountry
      }
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.post("/verify", authorization, async (req, res) => {
  try {
    const userId = req.user.user;
    
    const user = await pool.query(
      "SELECT user_id, user_name, user_email, user_role, country FROM logins WHERE user_id = $1",
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json("User not found");
    }

    const userRole = (user.rows[0].user_role || 'member').toLowerCase();
    
    res.json({
      authenticated: true,
      user: {
        id: user.rows[0].user_id,
        name: user.rows[0].user_name,
        email: user.rows[0].user_email,
        role: userRole,
        country: user.rows[0].country || 'India'
      }
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;

router.post("/verify", authorization, async (req, res) => {
  try {
    const userId = req.user.user;
    
    const user = await pool.query(
      "SELECT user_id, user_name, user_email, user_role, country FROM logins WHERE user_id = $1",
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json("User not found");
    }

    const userRole = (user.rows[0].user_role || 'member').toLowerCase();
    
    res.json({
      authenticated: true,
      user: {
        id: user.rows[0].user_id,
        name: user.rows[0].user_name,
        email: user.rows[0].user_email,
        role: userRole,
        country: user.rows[0].country || 'India'
      }
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;
