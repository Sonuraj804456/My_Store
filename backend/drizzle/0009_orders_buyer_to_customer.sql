-- Update orders table to use customer_id instead of buyer_id
-- Drop old columns
ALTER TABLE orders 
  DROP COLUMN IF EXISTS buyer_id,
  DROP COLUMN IF EXISTS buyer_email,
  DROP COLUMN IF EXISTS buyer_phone,
  DROP COLUMN IF EXISTS buyer_name;

-- Add customer_id column
ALTER TABLE orders 
  ADD COLUMN customer_id uuid NOT NULL DEFAULT gen_random_uuid();

-- Data migration would happen via application migration script
-- After that, the column can have a foreign key constraint
-- ALTER TABLE orders ADD CONSTRAINT fk_order_customer 
--   FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

-- Drop buyers table (no longer needed, using customers table instead)
DROP TABLE IF EXISTS buyers;
