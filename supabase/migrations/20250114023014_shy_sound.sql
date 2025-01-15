/*
  # Create email queue table

  1. New Tables
    - `email_queue`
      - `id` (uuid, primary key)
      - `to_email` (text)
      - `subject` (text)
      - `html_content` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `sent_at` (timestamp)
      - `error` (text)

  2. Security
    - Enable RLS on `email_queue` table
    - Add policy for public insert access
    - Add policy for service role to process emails
*/

CREATE TABLE IF NOT EXISTS email_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email text NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz,
  error text,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'failed'))
);

ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can queue emails"
  ON email_queue
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Service can process emails"
  ON email_queue
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);