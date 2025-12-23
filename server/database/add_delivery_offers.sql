-- Add delivery_available and offers fields to restaurants table
-- Run this migration to enable delivery status and offers management

ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS delivery_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS offers TEXT DEFAULT NULL;

-- Create a global delivery status table (optional - for app-wide delivery toggle)
CREATE TABLE IF NOT EXISTS app_settings (
  setting_id SERIAL PRIMARY KEY,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_by INTEGER REFERENCES logins(user_id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO app_settings (setting_key, setting_value) 
VALUES ('delivery_available', 'false')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO app_settings (setting_key, setting_value) 
VALUES ('offers', '')
ON CONFLICT (setting_key) DO NOTHING;

-- Update existing restaurants to have default values
UPDATE restaurants 
SET delivery_available = false 
WHERE delivery_available IS NULL;

UPDATE restaurants 
SET offers = NULL 
WHERE offers IS NULL;


-- Run this migration to enable delivery status and offers management

ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS delivery_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS offers TEXT DEFAULT NULL;

-- Create a global delivery status table (optional - for app-wide delivery toggle)
CREATE TABLE IF NOT EXISTS app_settings (
  setting_id SERIAL PRIMARY KEY,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_by INTEGER REFERENCES logins(user_id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO app_settings (setting_key, setting_value) 
VALUES ('delivery_available', 'false')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO app_settings (setting_key, setting_value) 
VALUES ('offers', '')
ON CONFLICT (setting_key) DO NOTHING;

-- Update existing restaurants to have default values
UPDATE restaurants 
SET delivery_available = false 
WHERE delivery_available IS NULL;

UPDATE restaurants 
SET offers = NULL 
WHERE offers IS NULL;



