export type LanguageProficiency = 
  | 'Beginner' 
  | 'Elementary' 
  | 'Intermediate' 
  | 'Upper Intermediate' 
  | 'Advanced' 
  | 'Fluent' 
  | 'Native';

export interface Language {
  id: string;
  code: string;
  name: string;
  nativeName?: string;
  flag?: string;
}

export interface UserLanguage {
  id: string;
  user_id: string;
  language_id: string;
  type: 'native' | 'learning';
  is_native?: boolean;
  proficiency: LanguageProficiency;
  language: Language;
}

export interface Interest {
  id: string;
  name: string;
  category?: string;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  country: string;
  timezone: string;
  created_at: string;
  updated_at?: string;
  is_online?: boolean;
  last_active?: string;
  availability?: string; // e.g., 'Weekday evenings', 'Weekends & evenings', 'Flexible'
  learning_goals?: string; // e.g. 'Conversational fluency & cultural exchange'
  community_intent?: ('practice' | 'help_others' | 'language_exchange')[];
  open_to_help?: boolean;
  looking_for_exchange?: boolean;
  onboarding_completed?: boolean;
  native_languages: UserLanguage[];
  learning_languages: UserLanguage[];
  interests: string[];
  preferred_topics?: string[];
}

export interface PartnerMatch {
  id: string;
  user_id: string;
  matched_user_id: string;
  partner: Profile;
  match_type?: 'mutual_exchange' | 'fluent_partner' | 'can_help' | 'general';
  exchange_headline?: string;
  exchange_description?: string;
  compatibility_score: number;
  compatibility_reasons: string[];
  reasons?: string[];
  shared_interests?: string[];
  status: 'suggested' | 'connected' | 'saved' | 'skipped' | 'pending';
  created_at: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  members: Profile[];
  last_message?: Message;
  unread_count: number;
}

export interface ConversationMember {
  conversation_id: string;
  user_id: string;
  user?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string | null;
  is_topic_starter?: boolean;
  topic_title?: string;
  topic_category?: string;
}

export interface ConversationTopic {
  id: string;
  title: string;
  prompt: string;
  category: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  language_id?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'message' | 'match' | 'system';
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  link?: string;
}

export interface Block {
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: 'Harassment' | 'Spam' | 'Inappropriate content' | 'Fake profile' | 'Hate or abuse' | 'Other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}

export interface MatchFilters {
  practiceLanguage: string;
  speakerLanguage: string;
  proficiency: string;
  interest: string;
  availability: string;
  searchQuery: string;
}

export interface OnboardingData {
  nativeLanguages: { languageId: string; proficiency: LanguageProficiency }[];
  learningLanguages: { languageId: string; proficiency: LanguageProficiency; goal?: string }[];
  communityIntent: ('practice' | 'help_others' | 'language_exchange')[];
  interests: string[];
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  bio: string;
  country: string;
  timezone?: string;
  availability: string;
  learningGoal?: string;
}
