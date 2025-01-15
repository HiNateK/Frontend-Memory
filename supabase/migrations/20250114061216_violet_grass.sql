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
  session_id uuid REFERENCES live_chat_sessions(id),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_agent boolean DEFAULT false,
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

CREATE POLICY "Users can view their own chat sessions"
  ON live_chat_sessions
  FOR SELECT
  TO public
  USING (email = current_user_email());

-- Create policies for live_chat_messages
CREATE POLICY "Anyone can send messages"
  ON live_chat_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view messages from their sessions"
  ON live_chat_messages
  FOR SELECT
  TO public
  USING (
    session_id IN (
      SELECT id FROM live_chat_sessions 
      WHERE email = current_user_email()
    )
  );