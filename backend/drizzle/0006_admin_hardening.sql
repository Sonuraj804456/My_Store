ALTER TABLE stores
  ADD COLUMN is_suspended boolean NOT NULL DEFAULT false,
  ADD COLUMN suspension_reason text,
  ADD COLUMN suspended_at timestamp with time zone;

ALTER TABLE payouts
  ADD COLUMN is_frozen boolean NOT NULL DEFAULT false;

CREATE TABLE admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  admin_id varchar(255) NOT NULL,
  action varchar(120) NOT NULL,
  entity_type varchar(80) NOT NULL,
  entity_id varchar(255) NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
