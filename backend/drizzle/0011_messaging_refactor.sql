-- Update conversations table to use merchant_id and customer_id
-- First, update the enum for message_sender_role
ALTER TYPE message_sender_role RENAME TO message_sender_role_old;

CREATE TYPE message_sender_role AS ENUM('MERCHANT', 'CUSTOMER', 'ADMIN');

ALTER TABLE messages ALTER COLUMN sender_role TYPE message_sender_role USING sender_role::text::message_sender_role;

DROP TYPE message_sender_role_old;

-- Update conversations table columns
ALTER TABLE conversations 
  RENAME COLUMN creator_id TO merchant_id;

ALTER TABLE conversations
  DROP COLUMN IF EXISTS buyer_id,
  DROP COLUMN IF EXISTS buyer_email;

ALTER TABLE conversations
  ADD COLUMN customer_id uuid NOT NULL DEFAULT gen_random_uuid();

-- Add indices
CREATE INDEX idx_conversations_merchant_id ON conversations(merchant_id);
CREATE INDEX idx_conversations_customer_id ON conversations(customer_id);
