// Supabase Edge Function: get-matches
// Calls the secure get_discovery_partners SQL function
// URL: POST /functions/v1/get-matches

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const {
      limit = 20,
      offset = 0,
      practice_language_id = null,
      speaker_language_id = null,
      proficiency = null,
      search_query = null,
      interest_id = null,
      availability = null,
      country = null,
    } = body;

    // Call the secure SQL function
    const { data, error } = await supabase.rpc('get_discovery_partners', {
      p_user_id:              user.id,
      p_limit:                limit,
      p_offset:               offset,
      p_practice_language_id: practice_language_id,
      p_speaker_language_id:  speaker_language_id,
      p_proficiency:          proficiency,
      p_search_query:         search_query,
      p_interest_id:          interest_id,
      p_availability:         availability,
      p_country:              country,
    });

    if (error) throw error;

    // Enrich with languages and interests
    const partnerIds = (data ?? []).map((p: any) => p.id);
    let partnerLanguages: any[] = [];
    let partnerInterests: any[] = [];

    if (partnerIds.length > 0) {
      const [{ data: langs }, { data: ints }] = await Promise.all([
        supabase
          .from('user_languages')
          .select('user_id, type, proficiency, language:languages(id, code, name, native_name, flag)')
          .in('user_id', partnerIds),
        supabase
          .from('user_interests')
          .select('user_id, interest:interests(name)')
          .in('user_id', partnerIds),
      ]);
      partnerLanguages = langs ?? [];
      partnerInterests = ints ?? [];
    }

    // Shape response into PartnerMatch format
    const matches = (data ?? []).map((p: any) => {
      const langs = partnerLanguages.filter((l: any) => l.user_id === p.id);
      const interests = partnerInterests
        .filter((i: any) => i.user_id === p.id)
        .map((i: any) => i.interest?.name)
        .filter(Boolean);

      const nativeLanguages = langs.filter((l: any) => l.type === 'native');
      const learningLanguages = langs.filter((l: any) => l.type === 'learning');

      // Build reasons from the real signals the SQL function computed —
      // ordered roughly by how strong a signal each one is.
      const reasons: string[] = [];
      if (p.match_type === 'mutual_exchange') {
        reasons.push('You can help each other practice');
      } else if (p.match_type === 'fluent_partner' && nativeLanguages[0]) {
        reasons.push(`Speaks ${nativeLanguages[0].language?.name} natively`);
      } else if (p.match_type === 'can_help' && learningLanguages[0]) {
        reasons.push(`Learning ${learningLanguages[0].language?.name}`);
      }
      if (p.shared_interest_count > 0) {
        const names = (p.shared_interest_names ?? []).slice(0, 3).join(', ');
        reasons.push(
          `${p.shared_interest_count} shared interest${p.shared_interest_count > 1 ? 's' : ''}: ${names}`
        );
      }
      if (p.is_online) reasons.push('Online right now');
      if (p.open_to_help) reasons.push('Open to helping others learn');
      if (reasons.length === 0) reasons.push('Community language learner');

      return {
        id:                    `match-${p.id}`,
        user_id:               user.id,
        matched_user_id:       p.id,
        compatibility_score:   p.compatibility_score,
        match_type:            p.match_type,
        status:                'suggested',
        compatibility_reasons: reasons,
        shared_interests:      p.shared_interest_names ?? [],
        created_at:            new Date().toISOString(),
        partner: {
          id:                   p.id,
          username:             p.username,
          display_name:         p.display_name,
          bio:                  p.bio,
          avatar_url:           p.avatar_url,
          country:              p.country,
          timezone:             p.timezone,
          availability:         p.availability,
          learning_goals:       p.learning_goals,
          is_online:            p.is_online,
          last_seen_at:         p.last_seen_at,
          open_to_help:         p.open_to_help,
          looking_for_exchange: p.looking_for_exchange,
          community_intent:     p.community_intent,
          native_languages:     nativeLanguages,
          learning_languages:   learningLanguages,
          interests,
          created_at:           new Date().toISOString(),
        },
      };
    });

    return new Response(JSON.stringify({ data: matches }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message ?? 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
