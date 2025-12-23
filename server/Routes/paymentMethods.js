const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const { checkRole } = require("../middleware/roleAuthorization");
const pool = require("../db");
const { encryptCardNumber, decryptCardNumber, getLast4Digits } = require("../utils/encryption");

router.get("/", authorization, async (req, res) => {
  try {
    const userId = req.user.user;
    const userRole = (req.user.role || 'member').toLowerCase();

    let query;
    let params;

    if (userRole === 'admin' || userRole === 'manager') {
      query = `
        SELECT pm.payment_id, pm.method_type, pm.card_number, pm.card_holder_name, 
               pm.expiry_date, pm.is_default, pm.user_id,
               l.user_name, l.user_email, l.country as user_country
        FROM payment_methods pm
        LEFT JOIN logins l ON pm.user_id = l.user_id
        ORDER BY l.country, pm.is_default DESC, pm.created_at DESC
      `;
      params = [];
    } else {
      query = `
        SELECT payment_id, method_type, card_number, card_holder_name, 
               expiry_date, is_default, user_id
        FROM payment_methods 
        WHERE user_id = $1 
        ORDER BY is_default DESC, created_at DESC
      `;
      params = [userId];
    }

    const paymentMethods = await pool.query(query, params);
    
    const processedMethods = paymentMethods.rows.map(pm => {
      try {
        const last4 = getLast4Digits(pm.card_number);
        return {
          ...pm,
          card_number: last4 && last4 !== 'N/A' ? `****${last4}` : '****N/A',
          card_number_encrypted: pm.card_number
        };
      } catch (err) {
        return {
          ...pm,
          card_number: '****N/A',
          card_number_encrypted: pm.card_number
        };
      }
    });

    res.json(processedMethods);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// POST - Add payment method (All authenticated users: admin, manager, member)
router.post("/", authorization, async (req, res) => {
  try {
    if (!req.user || !req.user.user) {
      return res.status(403).json({ error: "Authorization denied. Please authenticate first." });
    }

    const userId = req.user.user;
    const { method_type, card_number, card_holder_name, expiry_date, is_default } = req.body;

    const encryptedCardNumber = encryptCardNumber(card_number);

    if (is_default) {
      await pool.query(
        "UPDATE payment_methods SET is_default = false WHERE user_id = $1",
        [userId]
      );
    }

    const newPaymentMethod = await pool.query(
      "INSERT INTO payment_methods (user_id, method_type, card_number, card_holder_name, expiry_date, is_default) VALUES ($1, $2, $3, $4, $5, $6) RETURNING payment_id, method_type, card_number, card_holder_name, expiry_date, is_default",
      [userId, method_type, encryptedCardNumber, card_holder_name, expiry_date, is_default || false]
    );

    const result = newPaymentMethod.rows[0];
    const last4 = getLast4Digits(result.card_number);
    res.json({
      ...result,
      card_number: `****${last4}`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.put("/:payment_id", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const userId = req.user.user;
    const userRole = req.user.role || 'member';
    const { payment_id } = req.params;
    const { method_type, card_number, card_holder_name, expiry_date, is_default } = req.body;

    // Check if payment method exists
    const paymentMethod = await pool.query(
      "SELECT * FROM payment_methods WHERE payment_id = $1",
      [payment_id]
    );

    if (paymentMethod.rows.length === 0) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    // Admins and managers can update any payment method
    // Members can only update their own (but this shouldn't be called for members due to checkRole)
    const canUpdate = userRole === 'admin' || userRole === 'manager' || paymentMethod.rows[0].user_id === userId;

    if (!canUpdate) {
      return res.status(403).json({ error: "Access denied. You can only update your own payment methods." });
    }

    // Encrypt card number if provided
    const encryptedCardNumber = card_number ? encryptCardNumber(card_number) : paymentMethod.rows[0].card_number;

    if (is_default) {
      await pool.query(
        "UPDATE payment_methods SET is_default = false WHERE user_id = $1 AND payment_id != $2",
        [paymentMethod.rows[0].user_id, payment_id]
      );
    }

    const updatedPaymentMethod = await pool.query(
      "UPDATE payment_methods SET method_type = $1, card_number = $2, card_holder_name = $3, expiry_date = $4, is_default = $5 WHERE payment_id = $6 RETURNING payment_id, method_type, card_number, card_holder_name, expiry_date, is_default",
      [method_type, encryptedCardNumber, card_holder_name, expiry_date, is_default, payment_id]
    );

    // Return with masked card number
    const result = updatedPaymentMethod.rows[0];
    const last4 = getLast4Digits(result.card_number);
    res.json({
      ...result,
      card_number: `****${last4}`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// DELETE - Only ADMIN can delete payment methods
router.delete("/:payment_id", authorization, checkRole('admin'), async (req, res) => {
  try {
    const userId = req.user.user;
    const userRole = req.user.role || 'member';
    const { payment_id } = req.params;

    // Check if payment method exists
    const paymentMethod = await pool.query(
      "SELECT * FROM payment_methods WHERE payment_id = $1",
      [payment_id]
    );

    if (paymentMethod.rows.length === 0) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    // Only admins can delete payment methods
    const canDelete = userRole === 'admin';

    if (!canDelete) {
      return res.status(403).json({ error: "Access denied. You can only delete your own payment methods." });
    }

    await pool.query(
      "DELETE FROM payment_methods WHERE payment_id = $1 RETURNING payment_id",
      [payment_id]
    );

    res.json({ message: "Payment method deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});
module.exports = router;


