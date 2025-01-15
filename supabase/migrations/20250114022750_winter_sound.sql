/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text) 
      - `email` (text)
      - `message` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for public insert access
    - Add policy for authenticated users to read submissions
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Contact submissions are readable by authenticated users only"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);