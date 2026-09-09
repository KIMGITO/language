import { supabase, isSupabaseConfigured, callEdgeFunction } from './supabase';
import type { PartnerMatch, MatchFilters, Profile } from '../types';
import { INITIAL_MATCHES, MOCK_PARTNERS, MOCK_CURRENT_USER } from '../data/mockData';

let matchesState: PartnerMatch[] = [...INITIAL_MATCHES];

export const matchingService = {
  // ---------------------------------------------------------------
  // Fetch connected/saved matches for a user
  // ---------------------------------------------------------------
  async fetchMatches(userId: string): Promise<PartnerMatch[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('matches')
          .select(`
            id, user_id, matched_user_id, compatibility_score, match_type, status, created_at,
            partner:profiles!matched_user_id (
              id, username, display_name, bio, avatar_url, country, timezone,
              availability, learning_goals, is_online, last_seen_at,
              user_languages (
                id, type, proficiency,
                language:languages (id, code, name, native_name, flag)
              ),
              user_interests (
                interest:interests (name)
              )
            )
          `)
          .eq('user_id', userId)
          .in('status', ['connected', 'saved', 'pending'])
          .order('created_at', { ascending: false });

        if (error) throw error;

        return (data ?? []).map((row: any) => {
          const partner = row.partner;
          const nativeLanguages = (partner?.user_languages ?? [])
            .filter((ul: any) => ul.type === 'native')
            .map((ul: any) => ({ ...ul, user_id: partner.id, language_id: ul.language?.id ?? '' }));
          const learningLanguages = (partner?.user_languages ?? [])
            .filter((ul: any) => ul.type === 'learning')
            .map((ul: any) => ({ ...ul, user_id: partner.id, language_id: ul.language?.id ?? '' }));
          const interests = (partner?.user_interests ?? [])
            .map((ui: any) => ui.interest?.name)
            .filter(Boolean);

          return {
            id:                    row.id,
            user_id:               row.user_id,
            matched_user_id:       row.matched_user_id,
            compatibility_score:   row.compatibility_score,
            match_type:            row.match_type,
            status:                row.status,
            compatibility_reasons: [],
            created_at:            row.created_at,
            partner: {
              ...partner,
              native_languages:    nativeLanguages,
              learning_languages:  learningLanguages,
              interests,
            },
          } as PartnerMatch;
        });
      } catch (e) {
        console.warn('[matchingService] fetchMatches error:', e);
      }
    }

    await new Promise((r) => setTimeout(r, 200));
    return matchesState.filter((m) => m.status === 'connected' || m.status === 'saved');
  },

  // ---------------------------------------------------------------
  // Discover partners via Edge Function (secure, block-aware)
  // ---------------------------------------------------------------
  async discoverPartners(
    filters: MatchFilters,
    currentProfile: Profile = MOCK_CURRENT_USER
  ): Promise<PartnerMatch[]> {
    if (isSupabaseConfigured) {
      const body: Record<string, unknown> = {
        limit:  20,
        offset: 0,
      };

      if (filters.practiceLanguage && filters.practiceLanguage !== 'all') {
        body.practice_language_id = filters.practiceLanguage;
      }
      if (filters.speakerLanguage && filters.speakerLanguage !== 'all') {
        body.speaker_language_id = filters.speakerLanguage;
      }
      if (filters.proficiency && filters.proficiency !== 'all') {
        body.proficiency = filters.proficiency;
      }
      if (filters.searchQuery?.trim()) {
        body.search_query = filters.searchQuery.trim();
      }

      const { data, error } = await callEdgeFunction<{ data: PartnerMatch[] }>('get-matches', body);

      if (error) {
        console.warn('[matchingService] Edge Function error:', error);
      } else if (data?.data) {
        return data.data;
      }
    }

    // Mock discovery fallback
    await new Promise((r) => setTimeout(r, 250));
    let partners = [...MOCK_PARTNERS];

    if (filters.practiceLanguage && filters.practiceLanguage !== 'all') {
      partners = partners.filter((p) =>
        p.native_languages.some(
          (nl) => nl.language.name.toLowerCase() === filters.practiceLanguage.toLowerCase() ||
                  nl.language.id === filters.practiceLanguage
        )
      );
    }
    if (filters.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase();
      partners = partners.filter(
        (p) =>
          p.display_name.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q)
      );
    }

    return partners.map((partner) => {
      const existing = matchesState.find((m) => m.matched_user_id === partner.id);
      if (existing) return existing;

      let score = 70;
      let matchType: PartnerMatch['match_type'] = 'general';
      const reasons: string[] = [];

      const partnerSpeaksWhatUserLearns = partner.native_languages.some((nl) =>
        currentProfile.learning_languages.some((cll) => cll.language.id === nl.language.id)
      );
      const userSpeaksWhatPartnerLearns = currentProfile.native_languages.some((cnl) =>
        partner.learning_languages.some((pll) => pll.language.id === cnl.language.id)
      );

      if (partnerSpeaksWhatUserLearns && userSpeaksWhatPartnerLearns) {
        score += 26; matchType = 'mutual_exchange';
        reasons.push('You can help each other practice');
      } else if (partnerSpeaksWhatUserLearns) {
        score += 18; matchType = 'fluent_partner';
        reasons.push(`Speaks ${partner.native_languages[0]?.language.name} natively`);
      } else if (userSpeaksWhatPartnerLearns) {
        score += 12; matchType = 'can_help';
        reasons.push(`Learning ${partner.learning_languages[0]?.language.name}`);
      }

      return {
        id:                    `match-dyn-${partner.id}`,
        user_id:               currentProfile.id,
        matched_user_id:       partner.id,
        partner,
        match_type:            matchType,
        compatibility_score:   Math.min(score, 98),
        compatibility_reasons: reasons.length ? reasons : ['Community language learner'],
        status:                'suggested' as const,
        created_at:            new Date().toISOString(),
      };
    });
  },

  // ---------------------------------------------------------------
  // Connect with a partner (via Edge Function)
  // ---------------------------------------------------------------
  async connectPartner(userId: string, partnerId: string, score = 80): Promise<PartnerMatch | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await callEdgeFunction<{ data: { match_id: string; conversation_id: string } }>(
        'connect-partner',
        { partner_id: partnerId, compatibility_score: score }
      );

      if (error) {
        console.warn('[matchingService] connectPartner error:', error);
        return null;
      }

      // Update local state
      const existingIdx = matchesState.findIndex((m) => m.matched_user_id === partnerId);
      if (existingIdx >= 0) {
        matchesState[existingIdx] = { ...matchesState[existingIdx], status: 'connected' };
        return matchesState[existingIdx];
      }
    }

    // Mock fallback
    const existingIndex = matchesState.findIndex((m) => m.matched_user_id === partnerId);
    if (existingIndex >= 0) {
      matchesState[existingIndex] = { ...matchesState[existingIndex], status: 'connected' };
      return matchesState[existingIndex];
    }

    const partner = MOCK_PARTNERS.find((p) => p.id === partnerId);
    if (!partner) return null;

    const newMatch: PartnerMatch = {
      id:                    `match-${Date.now()}`,
      user_id:               userId,
      matched_user_id:       partnerId,
      partner,
      compatibility_score:   score,
      compatibility_reasons: ['Reciprocal language exchange'],
      status:                'connected',
      created_at:            new Date().toISOString(),
    };
    matchesState.push(newMatch);
    return newMatch;
  },

  // ---------------------------------------------------------------
  // Skip a partner (mark as skipped in DB)
  // ---------------------------------------------------------------
  async skipPartner(userId: string, partnerId: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('matches')
          .upsert({ user_id: userId, matched_user_id: partnerId, status: 'skipped' });
      } catch (e) {
        console.warn('[matchingService] skipPartner error:', e);
      }
    }

    const idx = matchesState.findIndex((m) => m.matched_user_id === partnerId);
    if (idx >= 0) {
      matchesState[idx] = { ...matchesState[idx], status: 'skipped' };
    }
  },
};
