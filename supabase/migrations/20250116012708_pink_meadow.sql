/*
  # Trial Customer Tracking Enhancement

  1. Add tracking table for trial signups
  2. Add trigger for trial customer creation
  3. Add function to get trial customer stats
*/

-- Create trial tracking table
CREATE TABLE IF NOT EXISTS trial_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  email text NOT NULL,
  signup_date timestamptz DEFAULT now(),
  trial_end_date timestamptz NOT NULL,
  converted_at timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'converted')),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE trial_signups ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own trial data"
  ON trial_signups
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

-- Create trigger function to track trial signups
CREATE OR REPLACE FUNCTION track_trial_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO trial_signups (
    customer_id,
    email,
    trial_end_date,
    metadata
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.trial_ends_at,
    jsonb_build_object(
      'first_name', NEW.first_name,
      'last_name', NEW.last_name,
      'signup_source', current_setting('app.signup_source', true)
    )
  );
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trial_signup_tracker ON customers;
CREATE TRIGGER trial_signup_tracker
  AFTER INSERT ON customers
  FOR EACH ROW
  WHEN (NEW.trial_ends_at IS NOT NULL)
  EXECUTE FUNCTION track_trial_signup();

-- Update trial customer creation function
CREATE OR REPLACE FUNCTION create_trial_customer(
  p_email text,
  p_first_name text,
  p_last_name text,
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_customer_id uuid;
  result jsonb;
BEGIN
  -- Set custom variable for tracking
  PERFORM set_config('app.signup_source', 'web_trial', true);

  -- Create customer
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

  -- Get created customer details
  SELECT jsonb_build_object(
    'customer_id', c.id,
    'email', c.email,
    'trial_ends_at', c.trial_ends_at,
    'subscription_id', s.id,
    'created_at', c.created_at
  ) INTO result
  FROM customers c
  LEFT JOIN subscriptions s ON s.customer_id = c.id
  WHERE c.id = new_customer_id;

  RETURN result;
END;
$$;