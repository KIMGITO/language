import { supabase, isSupabaseConfigured, callEdgeFunction } from './supabase';
import type { PartnerMatch, MatchFilters, Profile } from '../types';
import { INITIAL_MATCHES, MOCK_PARTNERS, MOCK_CURRENT_USER } from '../data/mockData';

let matchesState: PartnerMatch[] = [...INITIAL_MATCHES];

// ------------------------------------------------------------------
// Mirrors the scoring in supabase/migrations/006_matching_algorithm.sql
// (get_discovery_partners) so demo/offline mode behaves the same way as
// the real backend. If you change the weights here, change them there too.
//
//   30   base
//   +35  mutual exchange / +24 fluent partner / +15 can help
//   +15  shared interests (3 pts each, up to 5)
//   +5   partner is open to helping others
//   +5   both looking for reciprocal exchange
//   +5   partner is online right now
//   capped at 95 — never shows a fabricated 100% match
// ------------------------------------------------------------------
function computeCompatibility(
  currentProfile: Profile,
  partner: Profile
): {
  score: number;
  matchType: NonNullable<PartnerMatch['match_type']>;
  reasons: string[];
  sharedInterests: string[];
} {
  const partnerSpeaksWhatUserLearns = partner.native_languages.some((nl) =>
    currentProfile.learning_languages.some((cll) => cll.language.id === nl.language.id)
  );
  const userSpeaksWhatPartnerLearns = currentProfile.native_languages.some((cnl) =>
    partner.learning_languages.some((pll) => pll.language.id === cnl.language.id)
  );

  let matchType: NonNullable<PartnerMatch['match_type']> = 'general';
  let languagePoints = 0;
  const reasons: string[] = [];

  if (partnerSpeaksWhatUserLearns && userSpeaksWhatPartnerLearns) {
    matchType = 'mutual_exchange';
    languagePoints = 35;
    reasons.push('You can help each other practice');
  } else if (partnerSpeaksWhatUserLearns) {
    matchType = 'fluent_partner';
    languagePoints = 24;
    if (partner.native_languages[0]) {
      reasons.push(`Speaks ${partner.native_languages[0].language.name} natively`);
    }
  } else if (userSpeaksWhatPartnerLearns) {
    matchType = 'can_help';
    languagePoints = 15;
    if (partner.learning_languages[0]) {
      reasons.push(`Learning ${partner.learning_languages[0].language.name}`);
    }
  }

  const sharedInterests = (partner.interests || []).filter((i) =>
    (currentProfile.interests || []).includes(i)
  );
  const interestPoints = Math.min(sharedInterests.length, 5) * 3;
  if (sharedInterests.length > 0) {
    reasons.push(
      `${sharedInterests.length} shared interest${sharedInterests.length > 1 ? 's' : ''}: ${sharedInterests.slice(0, 3).join(', ')}`
    );
  }

  const onlinePoints = partner.is_online ? 5 : 0;
  if (partner.is_online) reasons.push('Online right now');

  const helpPoints = partner.open_to_help ? 5 : 0;
  if (partner.open_to_help) reasons.push('Open to helping others learn');

  const mutualExchangePoints =
    partner.looking_for_exchange && currentProfile.looking_for_exchange ? 5 : 0;

  if (reasons.length === 0) reasons.push('Community language learner');

  const score = Math.min(
    30 + languagePoints + interestPoints + onlinePoints + helpPoints + mutualExchangePoints,
    95
  );

  return { score, matchType, reasons, sharedInterests };
}

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
      if (filters.interest && filters.interest !== 'all') {
        body.interest_id = filters.interest;
      }
      if (filters.availability && filters.availability !== 'all') {
        body.availability = filters.availability;
      }
      if (filters.country && filters.country !== 'all') {
        body.country = filters.country;
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
    if (filters.interest && filters.interest !== 'all') {
      partners = partners.filter((p) => p.interests?.includes(filters.interest));
    }
    if (filters.country && filters.country !== 'all') {
      partners = partners.filter((p) => p.country === filters.country);
    }
    if (filters.availability && filters.availability !== 'all') {
      const needle = filters.availability.toLowerCase();
      partners = partners.filter((p) => p.availability?.toLowerCase().includes(needle));
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

      const { score, matchType, reasons, sharedInterests } = computeCompatibility(currentProfile, partner);

      return {
        id:                    `match-dyn-${partner.id}`,
        user_id:               currentProfile.id,
        matched_user_id:       partner.id,
        partner,
        match_type:            matchType,
        compatibility_score:   score,
        compatibility_reasons: reasons,
        shared_interests:      sharedInterests,
        status:                'suggested' as const,
        created_at:            new Date().toISOString(),
      };
    });
  },

  // ---------------------------------------------------------------
  // Connect with a partner (via Edge Function)
  // ---------------------------------------------------------------
  async connectPartner(userId: string, partnerId: string, score?: number): Promise<PartnerMatch | null> {
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

    const { score: computedScore, matchType, reasons } = computeCompatibility(MOCK_CURRENT_USER, partner);

    const newMatch: PartnerMatch = {
      id:                    `match-${Date.now()}`,
      user_id:               userId,
      matched_user_id:       partnerId,
      partner,
      match_type:            matchType,
      compatibility_score:   score ?? computedScore,
      compatibility_reasons: reasons,
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
