/*
  # Live Chat System Tables

  1. New Tables
    - `live_chat_sessions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `live_chat_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public insert access
    - Add policies for authenticated read access
*/

-- Create live chat sessions table
CREATE TABLE IF NOT EXISTS live_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('active', 'closed'))
);

-- Create live chat messages table
CREATE TABLE IF NOT EXISTS live_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE live_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for live_chat_sessions
CREATE POLICY "Anyone can create chat sessions"
  ON live_chat_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view chat sessions"
  ON live_chat_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for live_chat_messages
CREATE POLICY "Anyone can send messages"
  ON live_chat_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages"
  ON live_chat_messages
  FOR SELECT
  TO authenticated
  USING (true);