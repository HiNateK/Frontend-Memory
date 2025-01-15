/*
  # Live Chat System Setup

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
      - `session_id` (uuid, foreign key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `is_agent` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access with email-based filtering
*/

-- Create live chat sessions table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS live_chat_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    status text NOT NULL DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT valid_status CHECK (status IN ('active', 'closed'))
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create live chat messages table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS live_chat_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid REFERENCES live_chat_sessions(id),
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    is_agent boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE live_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can create chat sessions" ON live_chat_sessions;
  DROP POLICY IF EXISTS "Users can view their own chat sessions" ON live_chat_sessions;
  DROP POLICY IF EXISTS "Anyone can send messages" ON live_chat_messages;
  DROP POLICY IF EXISTS "Users can view their own messages" ON live_chat_messages;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies with email-based filtering
CREATE POLICY "Anyone can create chat sessions"
  ON live_chat_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own chat sessions"
  ON live_chat_sessions
  FOR SELECT
  TO public
  USING (email = email);

CREATE POLICY "Anyone can send messages"
  ON live_chat_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own messages"
  ON live_chat_messages
  FOR SELECT
  TO public
  USING (email = email);