/*
  # Customer Management System

  1. New Tables
    - `customers`
      - Core customer information
      - Authentication and profile data
    - `subscriptions`
      - Subscription details and status
      - Payment history and plan information
    - `gift_records`
      - Gift purchase and redemption tracking
    - `payment_history`
      - Detailed payment records
      - Transaction tracking

  2. Security
    - Enable RLS on all tables
    - Strict policies for data access
    - Admin-only management capabilities
*/

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text NOT NULL,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(email)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  plan_price decimal(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'expired', 'trial')),
  trial_ends_at timestamptz,
  current_period_starts_at timestamptz NOT NULL DEFAULT now(),
  current_period_ends_at timestamptz NOT NULL,
  canceled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  stripe_subscription_id text,
  stripe_customer_id text,
  payment_method_id text,
  auto_renew boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Gift records table
CREATE TABLE IF NOT EXISTS gift_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES customers(id),
  recipient_email text NOT NULL,
  plan_name text NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'redeemed', 'expired')),
  created_at timestamptz DEFAULT now(),
  redeemed_at timestamptz,
  expires_at timestamptz,
  redemption_code text UNIQUE,
  message text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Payment history table
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'usd',
  status text NOT NULL CHECK (status IN ('succeeded', 'failed', 'refunded', 'pending')),
  payment_method text,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Customers Policies
CREATE POLICY "Users can view their own customer data"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer data"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Subscriptions Policies
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can cancel their own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ))
  WITH CHECK (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

-- Gift Records Policies
CREATE POLICY "Users can view gifts they've sent or received"
  ON gift_records
  FOR SELECT
  TO authenticated
  USING (
    sender_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
    OR
    recipient_email IN (SELECT email FROM customers WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create gift records"
  ON gift_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- Payment History Policies
CREATE POLICY "Users can view their own payment history"
  ON payment_history
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

-- Create admin role
CREATE ROLE admin;

-- Admin Policies
CREATE POLICY "Admins have full access to customers"
  ON customers
  TO admin
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins have full access to subscriptions"
  ON subscriptions
  TO admin
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins have full access to gift records"
  ON gift_records
  TO admin
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins have full access to payment history"
  ON payment_history
  TO admin
  USING (true)
  WITH CHECK (true);

-- Indexes for better query performance
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_gift_records_sender_id ON gift_records(sender_id);
CREATE INDEX idx_gift_records_recipient_email ON gift_records(recipient_email);
CREATE INDEX idx_payment_history_customer_id ON payment_history(customer_id);
CREATE INDEX idx_payment_history_subscription_id ON payment_history(subscription_id);

-- Functions for common operations
CREATE OR REPLACE FUNCTION cancel_subscription(subscription_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE subscriptions
  SET 
    status = 'canceled',
    canceled_at = now(),
    auto_renew = false
  WHERE id = subscription_uuid
  AND customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  );
  
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION get_customer_details(customer_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT json_build_object(
    'customer', row_to_json(c),
    'subscription', row_to_json(s),
    'payments', json_agg(p),
    'gifts', json_agg(g)
  )::jsonb INTO result
  FROM customers c
  LEFT JOIN subscriptions s ON s.customer_id = c.id
  LEFT JOIN payment_history p ON p.customer_id = c.id
  LEFT JOIN gift_records g ON g.sender_id = c.id
  WHERE c.id = customer_uuid
  AND c.user_id = auth.uid()
  GROUP BY c.id, s.id;
  
  RETURN result;
END;
$$;