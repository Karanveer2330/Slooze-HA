const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const { checkCountry, checkRole } = require("../middleware/roleAuthorization");
const pool = require("../db");

// GET - Get app settings (delivery status and offers) - MUST BE BEFORE /:restaurant_id routes
router.get("/settings", authorization, async (req, res) => {
  try {
    let deliveryAvailable = false;
    let offers = '';
    
    try {
      const settings = await pool.query(
        "SELECT setting_key, setting_value FROM app_settings WHERE setting_key IN ('delivery_available', 'offers')"
      );
      
      deliveryAvailable = settings.rows.find(s => s.setting_key === 'delivery_available')?.setting_value === 'true';
      offers = settings.rows.find(s => s.setting_key === 'offers')?.setting_value || '';
    } catch (settingsError) {
      // If app_settings table doesn't exist, return defaults
      console.log('app_settings table not found. Run migration: server/database/add_delivery_offers.sql');
      return res.json({
        delivery_available: false,
        offers: ''
      });
    }

    res.json({
      delivery_available: deliveryAvailable,
      offers: offers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// PUT - Update app settings (Admin/Manager only) - MUST BE BEFORE /:restaurant_id routes
router.put("/settings", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { delivery_available, offers } = req.body;
    const userId = req.user.id;

    // Try to create table if it doesn't exist
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_settings (
          setting_id SERIAL PRIMARY KEY,
          setting_key VARCHAR(50) UNIQUE NOT NULL,
          setting_value TEXT,
          updated_by INTEGER REFERENCES logins(user_id),
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (createError) {
      // Table might already exist, continue
      console.log('Table creation check:', createError.message);
    }

    if (delivery_available !== undefined) {
      try {
        await pool.query(
          "INSERT INTO app_settings (setting_key, setting_value, updated_by) VALUES ($1, $2, $3) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP",
          ['delivery_available', delivery_available.toString(), userId]
        );
      } catch (insertError) {
        console.error('Error inserting delivery_available:', insertError.message);
        throw insertError;
      }
    }

    if (offers !== undefined) {
      try {
        await pool.query(
          "INSERT INTO app_settings (setting_key, setting_value, updated_by) VALUES ($1, $2, $3) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP",
          ['offers', offers, userId]
        );
      } catch (insertError) {
        console.error('Error inserting offers:', insertError.message);
        throw insertError;
      }
    }

    const settings = await pool.query(
      "SELECT setting_key, setting_value FROM app_settings WHERE setting_key IN ('delivery_available', 'offers')"
    );
    
    const deliveryAvailable = settings.rows.find(s => s.setting_key === 'delivery_available')?.setting_value === 'true';
    const offersValue = settings.rows.find(s => s.setting_key === 'offers')?.setting_value || '';

    res.json({
      delivery_available: deliveryAvailable,
      offers: offersValue
    });
  } catch (err) {
    console.error('Settings save error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ 
      error: err.message || "Server error",
      details: "Make sure the app_settings table exists. Run the migration: server/database/add_delivery_offers.sql"
    });
  }
});

router.get("/", authorization, checkCountry, async (req, res) => {
  try {
    const userCountry = req.user.country || 'India';

    const restaurants = await pool.query(
      "SELECT * FROM restaurants WHERE country = $1 ORDER BY name",
      [userCountry]
    );

    // Get app-wide delivery status and offers (with error handling if table doesn't exist)
    let deliveryAvailable = false;
    let offers = '';
    
    try {
      const settings = await pool.query(
        "SELECT setting_key, setting_value FROM app_settings WHERE setting_key IN ('delivery_available', 'offers')"
      );
      
      deliveryAvailable = settings.rows.find(s => s.setting_key === 'delivery_available')?.setting_value === 'true';
      offers = settings.rows.find(s => s.setting_key === 'offers')?.setting_value || '';
    } catch (settingsError) {
      // If app_settings table doesn't exist, use defaults
      console.log('app_settings table not found, using defaults. Run migration: server/database/add_delivery_offers.sql');
      deliveryAvailable = false;
      offers = '';
    }

    res.json({
      restaurants: restaurants.rows,
      delivery_available: deliveryAvailable,
      offers: offers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.get("/:restaurant_id/menu", authorization, checkCountry, async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const userCountry = req.user.country || 'India';

    const restaurant = await pool.query(
      "SELECT * FROM restaurants WHERE restaurant_id = $1 AND country = $2",
      [restaurant_id, userCountry]
    );

    if (restaurant.rows.length === 0) {
      return res.status(404).json("Restaurant not found");
    }

    const menuItems = await pool.query(
      "SELECT * FROM items WHERE restaurant_id = $1",
      [restaurant_id]
    );

    res.json({
      restaurant: restaurant.rows[0],
      menu: menuItems.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// POST - Create restaurant (Admin/Manager only)
router.post("/", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { name, description, location, country, image_url, delivery_available, offers } = req.body;
    const userCountry = req.user.country || 'India';

    const newRestaurant = await pool.query(
      "INSERT INTO restaurants (name, description, location, country, image_url, delivery_available, offers) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, description, location, country || userCountry, image_url, delivery_available || false, offers || null]
    );

    res.json(newRestaurant.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// PUT - Update restaurant (Admin/Manager only)
router.put("/:restaurant_id", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const { name, description, location, country, image_url, delivery_available, offers } = req.body;

    const updatedRestaurant = await pool.query(
      "UPDATE restaurants SET name = $1, description = $2, location = $3, country = $4, image_url = $5, delivery_available = COALESCE($6, delivery_available), offers = COALESCE($7, offers) WHERE restaurant_id = $8 RETURNING *",
      [name, description, location, country, image_url, delivery_available, offers, restaurant_id]
    );

    if (updatedRestaurant.rows.length === 0) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json(updatedRestaurant.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// DELETE - Delete restaurant (Admin/Manager only)
router.delete("/:restaurant_id", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    const deletedRestaurant = await pool.query(
      "DELETE FROM restaurants WHERE restaurant_id = $1 RETURNING *",
      [restaurant_id]
    );

    if (deletedRestaurant.rows.length === 0) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;


const authorization = require("../middleware/authorization");
const { checkCountry, checkRole } = require("../middleware/roleAuthorization");
const pool = require("../db");

// GET - Get app settings (delivery status and offers) - MUST BE BEFORE /:restaurant_id routes
router.get("/settings", authorization, async (req, res) => {
  try {
    let deliveryAvailable = false;
    let offers = '';
    
    try {
      const settings = await pool.query(
        "SELECT setting_key, setting_value FROM app_settings WHERE setting_key IN ('delivery_available', 'offers')"
      );
      
      deliveryAvailable = settings.rows.find(s => s.setting_key === 'delivery_available')?.setting_value === 'true';
      offers = settings.rows.find(s => s.setting_key === 'offers')?.setting_value || '';
    } catch (settingsError) {
      // If app_settings table doesn't exist, return defaults
      console.log('app_settings table not found. Run migration: server/database/add_delivery_offers.sql');
      return res.json({
        delivery_available: false,
        offers: ''
      });
    }

    res.json({
      delivery_available: deliveryAvailable,
      offers: offers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// PUT - Update app settings (Admin/Manager only) - MUST BE BEFORE /:restaurant_id routes
router.put("/settings", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { delivery_available, offers } = req.body;
    const userId = req.user.id;

    // Try to create table if it doesn't exist
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_settings (
          setting_id SERIAL PRIMARY KEY,
          setting_key VARCHAR(50) UNIQUE NOT NULL,
          setting_value TEXT,
          updated_by INTEGER REFERENCES logins(user_id),
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (createError) {
      // Table might already exist, continue
      console.log('Table creation check:', createError.message);
    }

    if (delivery_available !== undefined) {
      try {
        await pool.query(
          "INSERT INTO app_settings (setting_key, setting_value, updated_by) VALUES ($1, $2, $3) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP",
          ['delivery_available', delivery_available.toString(), userId]
        );
      } catch (insertError) {
        console.error('Error inserting delivery_available:', insertError.message);
        throw insertError;
      }
    }

    if (offers !== undefined) {
      try {
        await pool.query(
          "INSERT INTO app_settings (setting_key, setting_value, updated_by) VALUES ($1, $2, $3) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP",
          ['offers', offers, userId]
        );
      } catch (insertError) {
        console.error('Error inserting offers:', insertError.message);
        throw insertError;
      }
    }

    const settings = await pool.query(
      "SELECT setting_key, setting_value FROM app_settings WHERE setting_key IN ('delivery_available', 'offers')"
    );
    
    const deliveryAvailable = settings.rows.find(s => s.setting_key === 'delivery_available')?.setting_value === 'true';
    const offersValue = settings.rows.find(s => s.setting_key === 'offers')?.setting_value || '';

    res.json({
      delivery_available: deliveryAvailable,
      offers: offersValue
    });
  } catch (err) {
    console.error('Settings save error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ 
      error: err.message || "Server error",
      details: "Make sure the app_settings table exists. Run the migration: server/database/add_delivery_offers.sql"
    });
  }
});

router.get("/", authorization, checkCountry, async (req, res) => {
  try {
    const userCountry = req.user.country || 'India';

    const restaurants = await pool.query(
      "SELECT * FROM restaurants WHERE country = $1 ORDER BY name",
      [userCountry]
    );

    // Get app-wide delivery status and offers (with error handling if table doesn't exist)
    let deliveryAvailable = false;
    let offers = '';
    
    try {
      const settings = await pool.query(
        "SELECT setting_key, setting_value FROM app_settings WHERE setting_key IN ('delivery_available', 'offers')"
      );
      
      deliveryAvailable = settings.rows.find(s => s.setting_key === 'delivery_available')?.setting_value === 'true';
      offers = settings.rows.find(s => s.setting_key === 'offers')?.setting_value || '';
    } catch (settingsError) {
      // If app_settings table doesn't exist, use defaults
      console.log('app_settings table not found, using defaults. Run migration: server/database/add_delivery_offers.sql');
      deliveryAvailable = false;
      offers = '';
    }

    res.json({
      restaurants: restaurants.rows,
      delivery_available: deliveryAvailable,
      offers: offers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.get("/:restaurant_id/menu", authorization, checkCountry, async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const userCountry = req.user.country || 'India';

    const restaurant = await pool.query(
      "SELECT * FROM restaurants WHERE restaurant_id = $1 AND country = $2",
      [restaurant_id, userCountry]
    );

    if (restaurant.rows.length === 0) {
      return res.status(404).json("Restaurant not found");
    }

    const menuItems = await pool.query(
      "SELECT * FROM items WHERE restaurant_id = $1",
      [restaurant_id]
    );

    res.json({
      restaurant: restaurant.rows[0],
      menu: menuItems.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// POST - Create restaurant (Admin/Manager only)
router.post("/", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { name, description, location, country, image_url, delivery_available, offers } = req.body;
    const userCountry = req.user.country || 'India';

    const newRestaurant = await pool.query(
      "INSERT INTO restaurants (name, description, location, country, image_url, delivery_available, offers) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, description, location, country || userCountry, image_url, delivery_available || false, offers || null]
    );

    res.json(newRestaurant.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// PUT - Update restaurant (Admin/Manager only)
router.put("/:restaurant_id", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const { name, description, location, country, image_url, delivery_available, offers } = req.body;

    const updatedRestaurant = await pool.query(
      "UPDATE restaurants SET name = $1, description = $2, location = $3, country = $4, image_url = $5, delivery_available = COALESCE($6, delivery_available), offers = COALESCE($7, offers) WHERE restaurant_id = $8 RETURNING *",
      [name, description, location, country, image_url, delivery_available, offers, restaurant_id]
    );

    if (updatedRestaurant.rows.length === 0) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json(updatedRestaurant.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// DELETE - Delete restaurant (Admin/Manager only)
router.delete("/:restaurant_id", authorization, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    const deletedRestaurant = await pool.query(
      "DELETE FROM restaurants WHERE restaurant_id = $1 RETURNING *",
      [restaurant_id]
    );

    if (deletedRestaurant.rows.length === 0) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;

