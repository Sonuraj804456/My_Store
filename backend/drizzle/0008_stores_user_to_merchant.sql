-- Rename stores.user_id to merchant_id
-- First, drop the unique constraint on user_id
ALTER TABLE stores DROP CONSTRAINT IF EXISTS stores_user_id_unique;

-- Rename the column
ALTER TABLE stores RENAME COLUMN user_id TO merchant_id;

-- Make it reference merchants table instead (after data migration)
-- Note: At this point, merchant_id contains user_ids 
-- A data migration script should map user_ids to merchant ids
-- ALTER TABLE stores ADD CONSTRAINT fk_store_merchant 
--   FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE;

-- Add unique constraint on merchant_id
ALTER TABLE stores ADD CONSTRAINT stores_merchant_id_unique UNIQUE (merchant_id);
