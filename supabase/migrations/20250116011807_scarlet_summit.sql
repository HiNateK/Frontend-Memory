/*
  # Trial Users Management

  1. New Fields
    - Add trial_started_at and trial_ends_at to customers table
    - Add trial_converted_at to track when users convert to paid plans
  
  2. Functions
    - Add function to handle trial to paid conversion
    - Add function to get trial status
    
  3. Indexes
    - Add indexes for trial-related queries
*/

-- Add trial-related fields to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS trial_started_at timestamptz,
ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz,
ADD COLUMN IF NOT EXISTS trial_converted_at timestamptz;

-- Add trial status to valid subscription statuses
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_status_check;

ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_status_check 
CHECK (status IN ('active', 'canceled', 'expired', 'trial'));

-- Create function to handle trial conversion
CREATE OR REPLACE FUNCTION convert_trial_to_paid(
  customer_uuid uuid,
  new_plan_name text,
  new_plan_price decimal
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update customer record
  UPDATE customers
  SET 
    trial_converted_at = now(),
    updated_at = now()
  WHERE id = customer_uuid
  AND trial_ends_at IS NOT NULL
  AND trial_converted_at IS NULL;

  -- Update or create subscription
  INSERT INTO subscriptions (
    customer_id,
    plan_name,
    plan_price,
    status,
    current_period_starts_at,
    current_period_ends_at
  )
  VALUES (
    customer_uuid,
    new_plan_name,
    new_plan_price,
    'active',
    now(),
    now() + interval '1 month'
  )
  ON CONFLICT (customer_id) 
  DO UPDATE SET
    plan_name = EXCLUDED.plan_name,
    plan_price = EXCLUDED.plan_price,
    status = 'active',
    current_period_starts_at = EXCLUDED.current_period_starts_at,
    current_period_ends_at = EXCLUDED.current_period_ends_at,
    updated_at = now();

  RETURN FOUND;
END;
$$;

-- Create function to get trial status
CREATE OR REPLACE FUNCTION get_trial_status(customer_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT json_build_object(
    'is_trial', 
      CASE 
        WHEN trial_ends_at IS NULL THEN false
        WHEN trial_converted_at IS NOT NULL THEN false
        WHEN trial_ends_at < now() THEN false
        ELSE true
      END,
    'trial_started_at', trial_started_at,
    'trial_ends_at', trial_ends_at,
    'trial_converted_at', trial_converted_at,
    'days_remaining', 
      CASE 
        WHEN trial_ends_at IS NULL THEN 0
        WHEN trial_converted_at IS NOT NULL THEN 0
        WHEN trial_ends_at < now() THEN 0
        ELSE EXTRACT(DAY FROM trial_ends_at - now())::integer
      END
  )::jsonb INTO result
  FROM customers
  WHERE id = customer_uuid;
  
  RETURN result;
END;
$$;

-- Add indexes for trial-related queries
CREATE INDEX IF NOT EXISTS idx_customers_trial_ends_at 
ON customers(trial_ends_at);

CREATE INDEX IF NOT EXISTS idx_customers_trial_converted_at 
ON customers(trial_converted_at);

-- Add function to create trial customer
CREATE OR REPLACE FUNCTION create_trial_customer(
  p_email text,
  p_first_name text,
  p_last_name text,
  p_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_customer_id uuid;
BEGIN
  INSERT INTO customers (
    user_id,
    email,
    first_name,
    last_name,
    status,
    trial_started_at,
    trial_ends_at
  )
  VALUES (
    p_user_id,
    p_email,
    p_first_name,
    p_last_name,
    'active',
    now(),
    now() + interval '7 days'
  )
  RETURNING id INTO new_customer_id;

  -- Create trial subscription
  INSERT INTO subscriptions (
    customer_id,
    plan_name,
    plan_price,
    status,
    current_period_starts_at,
    current_period_ends_at,
    trial_ends_at
  )
  VALUES (
    new_customer_id,
    'Free Trial',
    0,
    'trial',
    now(),
    now() + interval '7 days',
    now() + interval '7 days'
  );

  RETURN new_customer_id;
END;
$$;