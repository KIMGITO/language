import { supabase, isSupabaseConfigured, getStorageUrl } from './supabase';
import type { Profile, Language, OnboardingData, UserLanguage } from '../types';
import { MOCK_CURRENT_USER, LANGUAGES, MOCK_PARTNERS } from '../data/mockData';

let currentProfileCache: Profile = { ...MOCK_CURRENT_USER };

export const profileService = {
  // ---------------------------------------------------------------
  // Get profile by user ID (with languages and interests)
  // ---------------------------------------------------------------
  async getProfile(userId: string): Promise<Profile | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id, username, display_name, bio, avatar_url, country, timezone,
            availability, learning_goals, community_intent, open_to_help,
            looking_for_exchange, onboarding_completed, is_online, last_seen_at,
            created_at, updated_at,
            user_languages (
              id, user_id, language_id, type, proficiency,
              language:languages (id, code, name, native_name, flag)
            ),
            user_interests (
              interest:interests (id, name, category)
            )
          `)
          .eq('id', userId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null; // not found
          throw error;
        }
        if (!data) return null;

        return mapProfileRow(data);
      } catch (e) {
        console.warn('[profileService] getProfile error:', e);
        return null;
      }
    }

    // Mock fallback
    if (userId === currentProfileCache.id) return currentProfileCache;
    return MOCK_PARTNERS.find((p) => p.id === userId) ?? currentProfileCache;
  },

  // ---------------------------------------------------------------
  // Update own profile fields
  // ---------------------------------------------------------------
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            display_name:          updates.display_name,
            bio:                   updates.bio,
            avatar_url:            updates.avatar_url,
            country:               updates.country,
            timezone:              updates.timezone,
            availability:          updates.availability,
            learning_goals:        updates.learning_goals,
            community_intent:      updates.community_intent,
            open_to_help:          updates.open_to_help,
            looking_for_exchange:  updates.looking_for_exchange,
          })
          .eq('id', userId);

        if (error) throw error;
      } catch (e) {
        console.warn('[profileService] updateProfile error:', e);
      }
    }

    currentProfileCache = { ...currentProfileCache, ...updates };
    return currentProfileCache;
  },

  // ---------------------------------------------------------------
  // Save onboarding data (languages, interests, profile fields)
  // ---------------------------------------------------------------
  async saveOnboardingProfile(userId: string, data: OnboardingData): Promise<Profile> {
    if (isSupabaseConfigured) {
      try {
        // 1. Resolve language IDs from seed table
        const { data: languages } = await supabase
          .from('languages')
          .select('id, code, name, native_name, flag');

        const langMap = new Map((languages ?? []).map((l) => [l.id, l]));

        // 2. Update profile row
        await supabase
          .from('profiles')
          .update({
            display_name:          data.displayName ?? currentProfileCache.display_name,
            bio:                   data.bio,
            country:               data.country,
            timezone:              data.timezone ?? '',
            availability:          data.availability,
            learning_goals:        data.learningGoal ?? '',
            community_intent:      data.communityIntent,
            open_to_help:          data.communityIntent.includes('help_others'),
            looking_for_exchange:  data.communityIntent.includes('language_exchange'),
            onboarding_completed:  true,
          })
          .eq('id', userId);

        // 3. Replace user_languages (delete old, insert new)
        await supabase.from('user_languages').delete().eq('user_id', userId);

        const langInserts = [
          ...data.nativeLanguages.map((item) => ({
            user_id:     userId,
            language_id: item.languageId,
            type:        'native' as const,
            proficiency: item.proficiency,
          })),
          ...data.learningLanguages.map((item) => ({
            user_id:     userId,
            language_id: item.languageId,
            type:        'learning' as const,
            proficiency: item.proficiency,
          })),
        ];

        if (langInserts.length > 0) {
          await supabase.from('user_languages').insert(langInserts);
        }

        // 4. Replace user_interests
        await supabase.from('user_interests').delete().eq('user_id', userId);

        // Resolve interest names to IDs
        const { data: interestRows } = await supabase
          .from('interests')
          .select('id, name')
          .in('name', data.interests);

        if (interestRows && interestRows.length > 0) {
          await supabase.from('user_interests').insert(
            interestRows.map((i) => ({ user_id: userId, interest_id: i.id }))
          );
        }

        // 5. Return updated profile from DB
        const fresh = await profileService.getProfile(userId);
        if (fresh) {
          currentProfileCache = fresh;
          return fresh;
        }
      } catch (e) {
        console.warn('[profileService] saveOnboardingProfile error:', e);
      }
    }

    // Mock fallback
    const nativeLangs: UserLanguage[] = data.nativeLanguages.map((item, idx) => {
      const l = LANGUAGES.find((lang) => lang.id === item.languageId) ?? LANGUAGES[0];
      return { id: `ul-nat-${idx}`, user_id: userId, language_id: l.id, type: 'native', proficiency: item.proficiency, language: l };
    });
    const learningLangs: UserLanguage[] = data.learningLanguages.map((item, idx) => {
      const l = LANGUAGES.find((lang) => lang.id === item.languageId) ?? LANGUAGES[1];
      return { id: `ul-learn-${idx}`, user_id: userId, language_id: l.id, type: 'learning', proficiency: item.proficiency, language: l };
    });

    currentProfileCache = {
      ...currentProfileCache,
      id:                  userId,
      bio:                 data.bio || currentProfileCache.bio,
      country:             data.country || currentProfileCache.country,
      availability:        data.availability || currentProfileCache.availability,
      learning_goals:      data.learningGoal || currentProfileCache.learning_goals,
      native_languages:    nativeLangs,
      learning_languages:  learningLangs,
      interests:           data.interests,
      onboarding_completed: true,
    };

    await new Promise((r) => setTimeout(r, 400));
    return currentProfileCache;
  },

  // ---------------------------------------------------------------
  // Upload avatar to Supabase Storage, return public URL
  // ---------------------------------------------------------------
  async uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      // Return a fake URL for dev mode
      return { url: URL.createObjectURL(file), error: null };
    }

    const ext = file.name.split('.').pop() ?? 'jpg';
    const filePath = `${userId}/avatar-${Date.now()}.${ext}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (uploadError) return { url: null, error: uploadError.message };

      const url = getStorageUrl('avatars', filePath);
      return { url, error: null };
    } catch (e: unknown) {
      return { url: null, error: e instanceof Error ? e.message : 'Upload failed' };
    }
  },

  // ---------------------------------------------------------------
  // Get all languages (from DB or mock)
  // ---------------------------------------------------------------
  async getLanguages(): Promise<Language[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('languages')
          .select('id, code, name, native_name, flag')
          .order('name');

        if (!error && data && data.length > 0) {
          return data.map((l) => ({
            id:         l.id,
            code:       l.code,
            name:       l.name,
            nativeName: l.native_name ?? undefined,
            flag:       l.flag ?? undefined,
          }));
        }
      } catch (e) {
        console.warn('[profileService] getLanguages error:', e);
      }
    }
    return LANGUAGES;
  },

  // ---------------------------------------------------------------
  // Get all interests (from DB or mock)
  // ---------------------------------------------------------------
  async getInterests(): Promise<{ id: string; name: string; category?: string }[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('interests')
          .select('id, name, category')
          .order('category')
          .order('name');

        if (!error && data) return data.map((i) => ({ id: i.id, name: i.name, category: i.category ?? undefined }));
      } catch (e) {
        console.warn('[profileService] getInterests error:', e);
      }
    }
    // Fallback from mockData interests list
    return [
      'Music', 'Movies & TV', 'Books & Literature', 'Art & Design', 'Photography',
      'Food & Cooking', 'Travel', 'Fashion & Style', 'Fitness & Wellness',
      'Technology', 'Gaming', 'Culture & Traditions', 'History', 'Science',
      'Football (Soccer)', 'Basketball', 'Hiking & Outdoors', 'Language Learning',
    ].map((name, i) => ({ id: `interest-${i}`, name }));
  },

  // ---------------------------------------------------------------
  // Update online presence
  // ---------------------------------------------------------------
  async updatePresence(userId: string, isOnline: boolean): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.rpc('update_user_presence', {
          p_user_id:   userId,
          p_is_online: isOnline,
        });
      } catch (e) {
        // Non-critical
      }
    }
  },
};

// ---------------------------------------------------------------
// Helper: Map raw Supabase profile row → Profile type
// ---------------------------------------------------------------
function mapProfileRow(data: any): Profile {
  const nativeLanguages: UserLanguage[] = (data.user_languages ?? [])
    .filter((ul: any) => ul.type === 'native')
    .map((ul: any) => ({
      id:          ul.id,
      user_id:     data.id,
      language_id: ul.language_id,
      type:        'native' as const,
      proficiency: ul.proficiency,
      language:    Array.isArray(ul.language) ? ul.language[0] : ul.language,
    }));

  const learningLanguages: UserLanguage[] = (data.user_languages ?? [])
    .filter((ul: any) => ul.type === 'learning')
    .map((ul: any) => ({
      id:          ul.id,
      user_id:     data.id,
      language_id: ul.language_id,
      type:        'learning' as const,
      proficiency: ul.proficiency,
      language:    Array.isArray(ul.language) ? ul.language[0] : ul.language,
    }));

  const interests: string[] = (data.user_interests ?? [])
    .map((ui: any) => (Array.isArray(ui.interest) ? ui.interest[0]?.name : ui.interest?.name))
    .filter(Boolean);

  return {
    id:                   data.id,
    username:             data.username ?? 'user',
    display_name:         data.display_name ?? 'Anonymous',
    bio:                  data.bio ?? '',
    avatar_url:           data.avatar_url ?? '',
    country:              data.country ?? '',
    timezone:             data.timezone ?? '',
    availability:         data.availability ?? undefined,
    learning_goals:       data.learning_goals ?? undefined,
    community_intent:     data.community_intent ?? [],
    open_to_help:         data.open_to_help ?? true,
    looking_for_exchange: data.looking_for_exchange ?? true,
    onboarding_completed: data.onboarding_completed ?? false,
    is_online:            data.is_online ?? false,
    last_active:          data.last_seen_at ? formatLastSeen(data.last_seen_at) : undefined,
    created_at:           data.created_at,
    updated_at:           data.updated_at,
    native_languages:     nativeLanguages,
    learning_languages:   learningLanguages,
    interests,
  };
}

function formatLastSeen(lastSeen: string): string {
  const diff = Date.now() - new Date(lastSeen).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Active now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
