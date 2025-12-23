const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test users data
const testUsers = [
  {
    user_name: 'Nick Fury',
    user_lname: 'Fury',
    user_email: 'nick.fury@example.com',
    user_password: 'password123', // Will be hashed
    user_role: 'admin',
    country: 'India',
    adr: '123 Shield St',
    adr1: 'Apt 1',
    city: 'New York',
    state: 'NY',
    zip: '10001'
  },
  {
    user_name: 'Captain Marvel',
    user_lname: 'Danvers',
    user_email: 'captain.marvel@example.com',
    user_password: 'password123',
    user_role: 'manager',
    country: 'India',
    adr: '456 Space Ave',
    adr1: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001'
  },
  {
    user_name: 'Captain America',
    user_lname: 'Rogers',
    user_email: 'captain.america@example.com',
    user_password: 'password123',
    user_role: 'manager',
    country: 'America',
    adr: '789 Liberty Blvd',
    adr1: 'Suite 2',
    city: 'New York',
    state: 'NY',
    zip: '10002'
  },
  {
    user_name: 'Thanos',
    user_lname: 'Titan',
    user_email: 'thanos@example.com',
    user_password: 'password123',
    user_role: 'member',
    country: 'India',
    adr: '999 Infinity Way',
    adr1: '',
    city: 'Delhi',
    state: 'Delhi',
    zip: '110001'
  },
  {
    user_name: 'Thor',
    user_lname: 'Odinson',
    user_email: 'thor@example.com',
    user_password: 'password123',
    user_role: 'member',
    country: 'India',
    adr: '777 Asgard Rd',
    adr1: '',
    city: 'Bangalore',
    state: 'Karnataka',
    zip: '560001'
  },
  {
    user_name: 'Travis',
    user_lname: 'Scott',
    user_email: 'travis@example.com',
    user_password: 'password123',
    user_role: 'member',
    country: 'America',
    adr: '321 Texas St',
    adr1: '',
    city: 'Houston',
    state: 'TX',
    zip: '77001'
  }
];

async function insertTestUsers() {
  try {
    console.log('Connecting to database...');
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✓ Connected to database');

    for (const user of testUsers) {
      try {
        // Check if user already exists
        const existingUser = await pool.query(
          'SELECT user_id FROM logins WHERE user_email = $1',
          [user.user_email]
        );

        if (existingUser.rows.length > 0) {
          console.log(`⚠ User ${user.user_email} already exists. Updating...`);
          
          // Hash password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(user.user_password, salt);
          
          // Update existing user
          await pool.query(
            `UPDATE logins 
             SET user_name = $1, user_lname = $2, user_password = $3, 
                 user_role = $4, country = $5, adr = $6, adr1 = $7, 
                 city = $8, state = $9, zip = $10
             WHERE user_email = $11`,
            [
              user.user_name,
              user.user_lname,
              hashedPassword,
              user.user_role,
              user.country,
              user.adr,
              user.adr1,
              user.city,
              user.state,
              user.zip,
              user.user_email
            ]
          );
          console.log(`✓ Updated: ${user.user_name} (${user.user_email}) - Role: ${user.user_role}, Country: ${user.country}`);
        } else {
          console.log(`+ Inserting: ${user.user_name} (${user.user_email})...`);
          
          // Hash password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(user.user_password, salt);
          
          // Insert new user
          const result = await pool.query(
            `INSERT INTO logins 
             (user_name, user_lname, user_email, user_password, user_role, country, adr, adr1, city, state, zip)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING user_id, user_name, user_email, user_role, country`,
            [
              user.user_name,
              user.user_lname,
              user.user_email,
              hashedPassword,
              user.user_role,
              user.country,
              user.adr,
              user.adr1,
              user.city,
              user.state,
              user.zip
            ]
          );
          console.log(`✓ Inserted: ${result.rows[0].user_name} (ID: ${result.rows[0].user_id}) - Role: ${result.rows[0].user_role}, Country: ${result.rows[0].country}`);
        }
      } catch (err) {
        console.error(`✗ Error processing ${user.user_email}:`, err.message);
      }
    }

    // Verify all users
    console.log('\n--- Verifying inserted users ---');
    const allUsers = await pool.query(
      `SELECT user_id, user_name, user_email, user_role, country 
       FROM logins 
       WHERE user_role IN ('admin', 'manager', 'member')
       ORDER BY user_role, country, user_name`
    );

    console.log(`\nTotal test users: ${allUsers.rows.length}`);
    console.log('\nUsers by role:');
    const byRole = {};
    allUsers.rows.forEach(user => {
      if (!byRole[user.user_role]) byRole[user.user_role] = [];
      byRole[user.user_role].push(user);
    });

    Object.keys(byRole).forEach(role => {
      console.log(`\n${role.toUpperCase()}:`);
      byRole[role].forEach(user => {
        console.log(`  - ${user.user_name} (${user.user_email}) - ${user.country}`);
      });
    });

    console.log('\n✓ Test users setup complete!');
    console.log('\nLogin credentials for all users:');
    console.log('  Email: <user_email>');
    console.log('  Password: password123');
    
  } catch (err) {
    console.error('✗ Database error:', err.message);
    console.error(err);
  } finally {
    await pool.end();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
insertTestUsers();



