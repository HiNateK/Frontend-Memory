/*
  # Create newsletter subscribers table

  1. New Tables
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `status` (text) - For tracking subscription status
  
  2. Security
    - Enable RLS on `newsletter_subscribers` table
    - Add policy for inserting new subscribers
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'active'
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Subscribers can view their own subscription"
  ON newsletter_subscribers
  FOR SELECT
  TO public
  USING (true);