-- Fix menu table: Add user_id column if it doesn't exist
-- Run this script to add the user_id column to the menu table

-- Add user_id column to menu table
ALTER TABLE menu 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES logins(user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_user_id ON menu(user_id);

-- Update existing rows to have a default user_id (optional - set to NULL or a specific user)
-- Uncomment the line below if you want to set existing cart items to a specific user
-- UPDATE menu SET user_id = 1 WHERE user_id IS NULL;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'menu' AND column_name = 'user_id';


-- Run this script to add the user_id column to the menu table

-- Add user_id column to menu table
ALTER TABLE menu 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES logins(user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_user_id ON menu(user_id);

-- Update existing rows to have a default user_id (optional - set to NULL or a specific user)
-- Uncomment the line below if you want to set existing cart items to a specific user
-- UPDATE menu SET user_id = 1 WHERE user_id IS NULL;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'menu' AND column_name = 'user_id';



