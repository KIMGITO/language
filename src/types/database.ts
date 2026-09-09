// Auto-generated Supabase database types for Language Exchange
// Re-generate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string;
          bio: string;
          avatar_url: string | null;
          country: string;
          timezone: string;
          availability: string | null;
          learning_goals: string | null;
          community_intent: string[];
          open_to_help: boolean;
          looking_for_exchange: boolean;
          onboarding_completed: boolean;
          is_online: boolean;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string;
          bio?: string;
          avatar_url?: string | null;
          country?: string;
          timezone?: string;
          availability?: string | null;
          learning_goals?: string | null;
          community_intent?: string[];
          open_to_help?: boolean;
          looking_for_exchange?: boolean;
          onboarding_completed?: boolean;
          is_online?: boolean;
          last_seen_at?: string | null;
        };
        Update: {
          username?: string | null;
          display_name?: string;
          bio?: string;
          avatar_url?: string | null;
          country?: string;
          timezone?: string;
          availability?: string | null;
          learning_goals?: string | null;
          community_intent?: string[];
          open_to_help?: boolean;
          looking_for_exchange?: boolean;
          onboarding_completed?: boolean;
          is_online?: boolean;
          last_seen_at?: string | null;
          updated_at?: string;
        };
      };
      languages: {
        Row: {
          id: string;
          code: string;
          name: string;
          native_name: string | null;
          flag: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          native_name?: string | null;
          flag?: string | null;
        };
        Update: {
          code?: string;
          name?: string;
          native_name?: string | null;
          flag?: string | null;
        };
      };
      interests: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
        };
        Update: {
          name?: string;
          category?: string | null;
        };
      };
      conversation_topics: {
        Row: {
          id: string;
          title: string;
          prompt: string;
          category: string;
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | null;
          language_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          prompt: string;
          category: string;
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | null;
          language_id?: string | null;
        };
        Update: {
          title?: string;
          prompt?: string;
          category?: string;
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | null;
          language_id?: string | null;
        };
      };
      user_languages: {
        Row: {
          id: string;
          user_id: string;
          language_id: string;
          type: 'native' | 'learning';
          proficiency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          language_id: string;
          type: 'native' | 'learning';
          proficiency: string;
        };
        Update: {
          type?: 'native' | 'learning';
          proficiency?: string;
        };
      };
      user_interests: {
        Row: {
          user_id: string;
          interest_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          interest_id: string;
        };
        Update: Record<string, never>;
      };
      matches: {
        Row: {
          id: string;
          user_id: string;
          matched_user_id: string;
          compatibility_score: number;
          match_type: 'mutual_exchange' | 'fluent_partner' | 'can_help' | 'general' | null;
          status: 'suggested' | 'connected' | 'saved' | 'skipped' | 'pending';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          matched_user_id: string;
          compatibility_score?: number;
          match_type?: 'mutual_exchange' | 'fluent_partner' | 'can_help' | 'general' | null;
          status?: 'suggested' | 'connected' | 'saved' | 'skipped' | 'pending';
        };
        Update: {
          compatibility_score?: number;
          match_type?: 'mutual_exchange' | 'fluent_partner' | 'can_help' | 'general' | null;
          status?: 'suggested' | 'connected' | 'saved' | 'skipped' | 'pending';
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
        };
        Update: {
          updated_at?: string;
        };
      };
      conversation_members: {
        Row: {
          conversation_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          conversation_id: string;
          user_id: string;
        };
        Update: Record<string, never>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_topic_starter: boolean;
          topic_title: string | null;
          topic_category: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_topic_starter?: boolean;
          topic_title?: string | null;
          topic_category?: string | null;
          read_at?: string | null;
        };
        Update: {
          read_at?: string | null;
        };
      };
      blocks: {
        Row: {
          blocker_id: string;
          blocked_id: string;
          created_at: string;
        };
        Insert: {
          blocker_id: string;
          blocked_id: string;
        };
        Update: Record<string, never>;
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_user_id: string;
          reason: string;
          description: string | null;
          status: 'pending' | 'reviewed' | 'resolved';
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          reported_user_id: string;
          reason: string;
          description?: string | null;
          status?: 'pending' | 'reviewed' | 'resolved';
        };
        Update: {
          status?: 'pending' | 'reviewed' | 'resolved';
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'message' | 'match' | 'system';
          title: string;
          body: string;
          read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'message' | 'match' | 'system';
          title: string;
          body: string;
          read?: boolean;
          link?: string | null;
        };
        Update: {
          read?: boolean;
        };
      };
    };
    Functions: {
      get_discovery_partners: {
        Args: {
          p_user_id: string;
          p_limit?: number;
          p_offset?: number;
          p_practice_language_id?: string | null;
          p_speaker_language_id?: string | null;
          p_proficiency?: string | null;
          p_search_query?: string | null;
        };
        Returns: {
          id: string;
          username: string;
          display_name: string;
          bio: string;
          avatar_url: string | null;
          country: string;
          timezone: string;
          availability: string | null;
          learning_goals: string | null;
          is_online: boolean;
          last_seen_at: string | null;
          open_to_help: boolean;
          looking_for_exchange: boolean;
          community_intent: string[];
          compatibility_score: number;
          match_type: string;
        }[];
      };
      get_or_create_conversation: {
        Args: { p_user_a: string; p_user_b: string };
        Returns: string;
      };
      connect_partner: {
        Args: { p_user_id: string; p_partner_id: string; p_score?: number };
        Returns: Json;
      };
      block_and_cleanup: {
        Args: { p_blocker_id: string; p_blocked_id: string };
        Returns: void;
      };
      get_unread_count: {
        Args: { p_user_id: string };
        Returns: number;
      };
      delete_user_account: {
        Args: { p_user_id: string };
        Returns: void;
      };
      update_user_presence: {
        Args: { p_user_id: string; p_is_online: boolean };
        Returns: void;
      };
    };
  };
}
