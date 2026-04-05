-- Create merchants table (store owners)
CREATE TABLE merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id varchar(255) UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_merchant_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create customers table (buyers)
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id varchar(255),
  email varchar(255) NOT NULL,
  phone varchar(20) NOT NULL,
  name varchar(255) NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(email, phone)
);

-- Create indexes
CREATE INDEX idx_merchants_user_id ON merchants(user_id);
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_email_phone ON customers(email, phone);

-- Remove role column from user table (after migration script handles data)
-- ALTER TABLE "user" DROP COLUMN role;
-- This will be done in a separate migration after data migration script runs
