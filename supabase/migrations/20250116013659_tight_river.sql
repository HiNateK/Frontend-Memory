/*
  # Customer Data Management Fix

  1. Add trigger to automatically create customer records
  2. Add function to handle customer creation
  3. Add function to sync auth users with customers
*/

-- Create function to ensure customer record exists
CREATE OR REPLACE FUNCTION ensure_customer_exists()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO customers (
    user_id,
    email,
    first_name,
    last_name,
    status,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'active',
    NEW.created_at
  )
  ON CONFLICT (email) DO UPDATE
  SET
    user_id = EXCLUDED.user_id,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Create trigger to create customer record on auth.user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION ensure_customer_exists();

-- Function to sync existing auth users with customers
CREATE OR REPLACE FUNCTION sync_auth_users_to_customers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO customers (
    user_id,
    email,
    first_name,
    last_name,
    status,
    created_at
  )
  SELECT
    au.id as user_id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'first_name', split_part(au.email, '@', 1)) as first_name,
    COALESCE(au.raw_user_meta_data->>'last_name', '') as last_name,
    'active' as status,
    au.created_at
  FROM auth.users au
  WHERE au.email NOT IN (
    SELECT email FROM customers
  )
  ON CONFLICT (email) DO UPDATE
  SET
    user_id = EXCLUDED.user_id,
    updated_at = now();
END;
$$;

-- Run initial sync
SELECT sync_auth_users_to_customers();

-- Create function to get customer data
CREATE OR REPLACE FUNCTION get_customer_data(p_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'customer', jsonb_build_object(
      'id', c.id,
      'email', c.email,
      'first_name', c.first_name,
      'last_name', c.last_name,
      'status', c.status,
      'created_at', c.created_at
    ),
    'subscription', CASE 
      WHEN s.id IS NOT NULL THEN jsonb_build_object(
        'id', s.id,
        'plan_name', s.plan_name,
        'status', s.status,
        'trial_ends_at', s.trial_ends_at,
        'current_period_ends_at', s.current_period_ends_at
      )
      ELSE NULL
    END,
    'trial', CASE 
      WHEN c.trial_ends_at IS NOT NULL THEN jsonb_build_object(
        'is_trial', c.trial_ends_at > now(),
        'trial_ends_at', c.trial_ends_at,
        'days_remaining', 
          CASE 
            WHEN c.trial_ends_at > now() 
            THEN EXTRACT(DAY FROM c.trial_ends_at - now())::integer
            ELSE 0
          END
      )
      ELSE NULL
    END
  ) INTO result
  FROM customers c
  LEFT JOIN subscriptions s ON s.customer_id = c.id
  WHERE c.email = p_email;

  RETURN result;
END;
$$;