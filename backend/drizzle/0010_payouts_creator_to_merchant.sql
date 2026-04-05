-- Update payouts table to use merchant_id instead of creator_id
ALTER TABLE payouts 
  RENAME COLUMN creator_id TO merchant_id;

-- Change merchant_id type from varchar to uuid (matching merchants.id)
-- Note: This will require a data migration script to map user IDs to merchant IDs
-- ALTER TABLE payouts ALTER COLUMN merchant_id TYPE uuid USING merchant_id::uuid;

-- Add index on merchant_id
CREATE INDEX idx_payouts_merchant_id ON payouts(merchant_id);
