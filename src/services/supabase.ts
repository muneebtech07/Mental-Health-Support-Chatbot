import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function saveMessage(sessionId: string, content: string, role: 'user' | 'bot') {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      content,
      role
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createChatSession(title: string) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      title
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getChatSessions() {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*, chat_messages(*)')
    .order('last_message_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getChatSession(sessionId: string) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*, chat_messages(*)')
    .eq('id', sessionId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateChatSession(sessionId: string, updates: { title?: string; last_message_at?: string }) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteChatSession(sessionId: string) {
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
}