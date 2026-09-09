import { supabase, isSupabaseConfigured } from './supabase';
import type { ConversationTopic } from '../types';

export const topicService = {
  // ---------------------------------------------------------------
  // Fetch conversation topic prompts with optional filters
  // ---------------------------------------------------------------
  async fetchTopics(filters?: {
    category?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    search?: string;
  }): Promise<ConversationTopic[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('conversation_topics')
          .select('id, title, prompt, category, difficulty, language_id')
          .order('category')
          .order('title');

        if (filters?.category && filters.category !== 'all') {
          query = query.eq('category', filters.category);
        }
        if (filters?.difficulty && filters.difficulty !== 'all') {
          query = query.eq('difficulty', filters.difficulty);
        }
        if (filters?.search?.trim()) {
          query = query.ilike('title', `%${filters.search.trim()}%`);
        }

        const { data, error } = await query;
        if (error) throw error;

        return (data ?? []).map((t) => ({
          id:         t.id,
          title:      t.title,
          prompt:     t.prompt,
          category:   t.category,
          difficulty: t.difficulty ?? undefined,
          language_id: t.language_id ?? undefined,
        }));
      } catch (e) {
        console.warn('[topicService] fetchTopics error:', e);
      }
    }

    // Fallback local topics
    return FALLBACK_TOPICS.filter((t) => {
      if (filters?.category && filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters?.difficulty && filters.difficulty !== 'all' && t.difficulty !== filters.difficulty) return false;
      if (filters?.search?.trim() && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  },

  // ---------------------------------------------------------------
  // Get unique topic categories
  // ---------------------------------------------------------------
  async fetchCategories(): Promise<string[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('conversation_topics')
          .select('category');

        if (!error && data) {
          return [...new Set(data.map((t) => t.category))].sort();
        }
      } catch (e) {
        console.warn('[topicService] fetchCategories error:', e);
      }
    }
    return [...new Set(FALLBACK_TOPICS.map((t) => t.category))].sort();
  },
};

// Fallback topics for non-configured state
const FALLBACK_TOPICS: ConversationTopic[] = [
  { id: 't1', title: 'Morning routines', prompt: 'Describe your typical morning routine.', category: 'Everyday Life', difficulty: 'Beginner' },
  { id: 't2', title: 'Traditional dishes', prompt: 'What is the most famous traditional dish from your country?', category: 'Food', difficulty: 'Beginner' },
  { id: 't3', title: 'Dream destination', prompt: 'If you could travel anywhere, where would you go and why?', category: 'Travel', difficulty: 'Beginner' },
  { id: 't4', title: 'Why are you learning this language?', prompt: 'What motivated you to start learning this language?', category: 'Language Learning', difficulty: 'Beginner' },
  { id: 't5', title: 'National holidays', prompt: 'What is your favorite national holiday and how do people celebrate it?', category: 'Culture', difficulty: 'Beginner' },
  { id: 't6', title: 'Technology in daily life', prompt: 'How has technology changed your daily life over the past 5 years?', category: 'Current Events', difficulty: 'Intermediate' },
  { id: 't7', title: 'Cultural differences while traveling', prompt: 'Have you ever been surprised by a cultural difference when visiting another country?', category: 'Travel', difficulty: 'Advanced' },
  { id: 't8', title: 'Work-life balance', prompt: 'How important is work-life balance in your culture?', category: 'Opinion', difficulty: 'Advanced' },
  { id: 't9', title: 'Funny language mistakes', prompt: 'Have you ever made a funny or embarrassing mistake in the language you are learning?', category: 'Language Learning', difficulty: 'Intermediate' },
  { id: 't10', title: 'Favorite childhood game', prompt: 'What was your favorite game to play as a child?', category: 'Hobbies', difficulty: 'Beginner' },
];
