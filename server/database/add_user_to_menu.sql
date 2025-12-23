-- Add user_id column to menu table to track who added items to cart
ALTER TABLE menu 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES logins(user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_user_id ON menu(user_id);



