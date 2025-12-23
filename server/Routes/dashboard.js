const router = require("express").Router();
const authorization = require("../middleware/authorization");
const pool = require("../db");

router.get("/", authorization, async (req, res) => {
  try {
    const userId = req.user.user;
    const user = await pool.query(
      "SELECT user_name, user_email, user_role, country FROM logins WHERE user_id = $1",
      [userId]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json("User not found");
    }
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error("Dashboard error:", err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;