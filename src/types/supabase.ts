export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          last_message_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          title: string
          created_at?: string
          last_message_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          last_message_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          content: string
          role: 'user' | 'bot'
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          content: string
          role: 'user' | 'bot'
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          content?: string
          role?: 'user' | 'bot'
          created_at?: string
        }
      }
    }
  }
}