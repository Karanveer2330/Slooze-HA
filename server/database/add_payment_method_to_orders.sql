-- Add payment_method_id to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method_id INTEGER REFERENCES payment_methods(payment_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_method_id ON orders(payment_method_id);



