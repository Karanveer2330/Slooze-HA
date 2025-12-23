const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fda',
  password: 'JassKaran2330',
  port: 5432,
});

async function runMigration() {
  try {
    console.log('Running delivery/offers migration...\n');
    
    // Create app_settings table
    console.log('1. Creating app_settings table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        setting_id SERIAL PRIMARY KEY,
        setting_key VARCHAR(50) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_by INTEGER REFERENCES logins(user_id),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('   ✓ app_settings table created\n');
    
    // Add columns to restaurants
    console.log('2. Adding columns to restaurants table...');
    await pool.query(`
      ALTER TABLE restaurants 
      ADD COLUMN IF NOT EXISTS delivery_available BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS offers TEXT DEFAULT NULL;
    `);
    console.log('   ✓ Columns added to restaurants table\n');
    
    // Insert default settings
    console.log('3. Inserting default settings...');
    await pool.query(`
      INSERT INTO app_settings (setting_key, setting_value) 
      VALUES ('delivery_available', 'false')
      ON CONFLICT (setting_key) DO NOTHING;
    `);
    
    await pool.query(`
      INSERT INTO app_settings (setting_key, setting_value) 
      VALUES ('offers', '')
      ON CONFLICT (setting_key) DO NOTHING;
    `);
    console.log('   ✓ Default settings inserted\n');
    
    console.log('✓ Migration completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Go to Dashboard → Settings tab');
    console.log('2. Enable "Delivery Available" checkbox');
    console.log('3. Enter offers text (optional)');
    console.log('4. Click "Save Settings"');
    console.log('\nThe banners will now appear on the menu page!');
    
  } catch (err) {
    console.error('✗ Migration error:', err.message);
    if (err.message.includes('does not exist')) {
      console.error('\nMake sure the database "fda" exists and the logins table is created.');
    }
  } finally {
    await pool.end();
  }
}

runMigration();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fda',
  password: 'JassKaran2330',
  port: 5432,
});

async function runMigration() {
  try {
    console.log('Running delivery/offers migration...\n');
    
    // Create app_settings table
    console.log('1. Creating app_settings table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        setting_id SERIAL PRIMARY KEY,
        setting_key VARCHAR(50) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_by INTEGER REFERENCES logins(user_id),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('   ✓ app_settings table created\n');
    
    // Add columns to restaurants
    console.log('2. Adding columns to restaurants table...');
    await pool.query(`
      ALTER TABLE restaurants 
      ADD COLUMN IF NOT EXISTS delivery_available BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS offers TEXT DEFAULT NULL;
    `);
    console.log('   ✓ Columns added to restaurants table\n');
    
    // Insert default settings
    console.log('3. Inserting default settings...');
    await pool.query(`
      INSERT INTO app_settings (setting_key, setting_value) 
      VALUES ('delivery_available', 'false')
      ON CONFLICT (setting_key) DO NOTHING;
    `);
    
    await pool.query(`
      INSERT INTO app_settings (setting_key, setting_value) 
      VALUES ('offers', '')
      ON CONFLICT (setting_key) DO NOTHING;
    `);
    console.log('   ✓ Default settings inserted\n');
    
    console.log('✓ Migration completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Go to Dashboard → Settings tab');
    console.log('2. Enable "Delivery Available" checkbox');
    console.log('3. Enter offers text (optional)');
    console.log('4. Click "Save Settings"');
    console.log('\nThe banners will now appear on the menu page!');
    
  } catch (err) {
    console.error('✗ Migration error:', err.message);
    if (err.message.includes('does not exist')) {
      console.error('\nMake sure the database "fda" exists and the logins table is created.');
    }
  } finally {
    await pool.end();
  }
}

runMigration();
