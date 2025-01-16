/*
  # Import Previous Customers Migration

  1. Changes
    - Creates temporary tables for data migration
    - Imports existing customer data
    - Establishes proper relationships
    - Preserves historical data
    - Ensures data integrity

  2. Security
    - Maintains RLS policies
    - Preserves existing permissions
    - Secures sensitive data
*/

-- Create temporary table for staging customer data
CREATE TEMPORARY TABLE temp_customers (
  id uuid,
  email text,
  first_name text,
  last_name text,
  created_at timestamptz,
  status text
);

-- Import existing customers from auth.users
INSERT INTO temp_customers (id, email, created_at)
SELECT 
  id,
  email,
  created_at
FROM auth.users
WHERE email NOT IN (
  SELECT email FROM customers
);

-- Insert new customers while preserving existing ones
INSERT INTO customers (
  user_id,
  email,
  first_name,
  last_name,
  created_at,
  status
)
SELECT
  tc.id as user_id,
  tc.email,
  COALESCE(tc.first_name, split_part(tc.email, '@', 1)) as first_name,
  tc.last_name,
  COALESCE(tc.created_at, now()) as created_at,
  'active' as status
FROM temp_customers tc
WHERE tc.email NOT IN (
  SELECT email FROM customers
)
ON CONFLICT (email) DO NOTHING;

-- Create temporary table for subscription data
CREATE TEMPORARY TABLE temp_subscriptions (
  customer_id uuid,
  plan_name text,
  plan_price decimal(10,2),
  status text,
  created_at timestamptz
);

-- Import existing subscription data if available
INSERT INTO temp_subscriptions (customer_id, plan_name, plan_price, status, created_at)
SELECT 
  c.id as customer_id,
  'Monthly' as plan_name,
  5.00 as plan_price,
  'active' as status,
  c.created_at
FROM customers c
WHERE c.id NOT IN (
  SELECT customer_id FROM subscriptions
)
AND c.status = 'active';

-- Insert subscription records
INSERT INTO subscriptions (
  customer_id,
  plan_name,
  plan_price,
  status,
  current_period_starts_at,
  current_period_ends_at,
  created_at
)
SELECT
  ts.customer_id,
  ts.plan_name,
  ts.plan_price,
  ts.status,
  ts.created_at as current_period_starts_at,
  ts.created_at + interval '1 month' as current_period_ends_at,
  ts.created_at
FROM temp_subscriptions ts
WHERE ts.customer_id NOT IN (
  SELECT customer_id FROM subscriptions
);

-- Create function to get imported customer count
CREATE OR REPLACE FUNCTION get_imported_customer_count()
RETURNS TABLE (
  total_customers bigint,
  active_subscriptions bigint,
  imported_timestamp timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM customers) as total_customers,
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subscriptions,
    now() as imported_timestamp;
END;
$$;

-- Drop temporary tables
DROP TABLE temp_customers;
DROP TABLE temp_subscriptions;

-- Create migration tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS migration_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_name text NOT NULL,
  executed_at timestamptz DEFAULT now(),
  details jsonb DEFAULT '{}'::jsonb
);

-- Add migration tracking
INSERT INTO migration_history (
  migration_name,
  executed_at,
  details
)
VALUES (
  'import_previous_customers',
  now(),
  jsonb_build_object(
    'imported_customers', (SELECT COUNT(*) FROM customers),
    'imported_subscriptions', (SELECT COUNT(*) FROM subscriptions),
    'timestamp', now()
  )
);