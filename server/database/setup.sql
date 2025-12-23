-- Complete Database Setup Script
-- Run this FIRST to create the database and initial tables

-- Step 1: Create database (run this in default postgres database first)
-- CREATE DATABASE fda;

-- Step 2: Connect to fda database and run the rest of this script

-- Create logins table if it doesn't exist
CREATE TABLE IF NOT EXISTS logins (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(100),
  user_lname VARCHAR(100),
  user_email VARCHAR(100) UNIQUE,
  user_password VARCHAR(255),
  adr VARCHAR(255),
  adr1 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(20),
  user_role VARCHAR(20) DEFAULT 'member' CHECK (user_role IN ('admin', 'manager', 'member')),
  country VARCHAR(50) DEFAULT 'India' CHECK (country IN ('India', 'America'))
);

-- Create orders table
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

-- Create menu table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS menu (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  ing VARCHAR(255),
  size VARCHAR(50),
  count INTEGER,
  price DECIMAL(10, 2)
);

-- Create food table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS food (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  ing VARCHAR(255),
  size VARCHAR(50),
  count INTEGER,
  price DECIMAL(10, 2)
);

-- Create items table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  fname VARCHAR(100),
  f_ing VARCHAR(255),
  f_img VARCHAR(255),
  f_price DECIMAL(10, 2),
  restaurant_id INTEGER
);

-- Create busi table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS busi (
  id SERIAL PRIMARY KEY,
  bname VARCHAR(100),
  description TEXT,
  pic VARCHAR(255),
  location VARCHAR(100)
);

-- Create busilogi table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS busilogi (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(100),
  user_password VARCHAR(255)
);

-- Update existing users to have default role
UPDATE logins SET user_role = 'member' WHERE user_role IS NULL;
UPDATE logins SET country = 'India' WHERE country IS NULL;



-- Run this FIRST to create the database and initial tables

-- Step 1: Create database (run this in default postgres database first)
-- CREATE DATABASE fda;

-- Step 2: Connect to fda database and run the rest of this script

-- Create logins table if it doesn't exist
CREATE TABLE IF NOT EXISTS logins (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(100),
  user_lname VARCHAR(100),
  user_email VARCHAR(100) UNIQUE,
  user_password VARCHAR(255),
  adr VARCHAR(255),
  adr1 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(20),
  user_role VARCHAR(20) DEFAULT 'member' CHECK (user_role IN ('admin', 'manager', 'member')),
  country VARCHAR(50) DEFAULT 'India' CHECK (country IN ('India', 'America'))
);

-- Create orders table
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

-- Create menu table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS menu (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  ing VARCHAR(255),
  size VARCHAR(50),
  count INTEGER,
  price DECIMAL(10, 2)
);

-- Create food table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS food (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  ing VARCHAR(255),
  size VARCHAR(50),
  count INTEGER,
  price DECIMAL(10, 2)
);

-- Create items table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  fname VARCHAR(100),
  f_ing VARCHAR(255),
  f_img VARCHAR(255),
  f_price DECIMAL(10, 2),
  restaurant_id INTEGER
);

-- Create busi table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS busi (
  id SERIAL PRIMARY KEY,
  bname VARCHAR(100),
  description TEXT,
  pic VARCHAR(255),
  location VARCHAR(100)
);

-- Create busilogi table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS busilogi (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(100),
  user_password VARCHAR(255)
);

-- Update existing users to have default role
UPDATE logins SET user_role = 'member' WHERE user_role IS NULL;
UPDATE logins SET country = 'India' WHERE country IS NULL;




