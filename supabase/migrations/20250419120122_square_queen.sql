/*
  # Chat Storage Schema and Thought Records

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text)
      - `avatar` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `created_at` (timestamptz)
      - `last_message_at` (timestamptz)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key to chat_sessions)
      - `content` (text)
      - `role` (text, either 'user' or 'bot')
      - `created_at` (timestamptz)

    - `thought_records`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `situation` (text)
      - `thoughts` (text)
      - `emotions` (text)
      - `behaviors` (text)
      - `alternative_thoughts` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  username text UNIQUE NOT NULL,
  avatar text NOT NULL DEFAULT '👤',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  role text CHECK (role IN ('user', 'bot')) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create thought_records table
CREATE TABLE thought_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  situation text NOT NULL,
  automatic_thoughts text[] NOT NULL,
  emotions jsonb NOT NULL,
  evidence_for text[] NOT NULL,
  evidence_against text[] NOT NULL,
  balanced_thought text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE thought_records ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for chat_sessions
CREATE POLICY "Users can create their own chat sessions"
  ON chat_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chat sessions"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions"
  ON chat_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions"
  ON chat_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for chat_messages
CREATE POLICY "Users can insert messages in their sessions"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE id = chat_messages.session_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view messages in their sessions"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE id = chat_messages.session_id
      AND user_id = auth.uid()
    )
  );

-- Policies for thought_records
CREATE POLICY "Users can create their own thought records"
  ON thought_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own thought records"
  ON thought_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own thought records"
  ON thought_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own thought records"
  ON thought_records
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS chat_sessions_user_id_idx ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS chat_sessions_last_message_at_idx ON chat_sessions(last_message_at DESC);
CREATE INDEX IF NOT EXISTS thought_records_user_id_idx ON thought_records(user_id);
CREATE INDEX IF NOT EXISTS thought_records_created_at_idx ON thought_records(created_at DESC);

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar)
  VALUES (new.id, new.email, '👤');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();