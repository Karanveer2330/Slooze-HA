-- Add role and country columns to logins table
ALTER TABLE logins 
ADD COLUMN IF NOT EXISTS user_role VARCHAR(20) DEFAULT 'member' CHECK (user_role IN ('admin', 'manager', 'member')),
ADD COLUMN IF NOT EXISTS country VARCHAR(50) DEFAULT 'India' CHECK (country IN ('India', 'America'));

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES logins(user_id),
  restaurant_id INTEGER,
  items JSONB,
  total_amount DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  payment_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES logins(user_id),
  method_type VARCHAR(50),
  card_number VARCHAR(20),
  card_holder_name VARCHAR(100),
  expiry_date VARCHAR(10),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  restaurant_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  location VARCHAR(100),
  country VARCHAR(50),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update existing users to have default role
UPDATE logins SET user_role = 'member' WHERE user_role IS NULL;
UPDATE logins SET country = 'India' WHERE country IS NULL;



ALTER TABLE logins 
ADD COLUMN IF NOT EXISTS user_role VARCHAR(20) DEFAULT 'member' CHECK (user_role IN ('admin', 'manager', 'member')),
ADD COLUMN IF NOT EXISTS country VARCHAR(50) DEFAULT 'India' CHECK (country IN ('India', 'America'));

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES logins(user_id),
  restaurant_id INTEGER,
  items JSONB,
  total_amount DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  payment_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES logins(user_id),
  method_type VARCHAR(50),
  card_number VARCHAR(20),
  card_holder_name VARCHAR(100),
  expiry_date VARCHAR(10),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  restaurant_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  location VARCHAR(100),
  country VARCHAR(50),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update existing users to have default role
UPDATE logins SET user_role = 'member' WHERE user_role IS NULL;
UPDATE logins SET country = 'India' WHERE country IS NULL;




