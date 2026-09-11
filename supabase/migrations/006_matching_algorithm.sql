-- ============================================================
-- Migration 006: Real matching algorithm
--
-- Replaces the placeholder scoring in get_discovery_partners (which only
-- looked at language reciprocity) with a multi-signal compatibility score,
-- and wires up three filters that existed in the UI but were silently
-- dropped before reaching the database: interest, availability, country.
--
-- Score breakdown (caps at 95, never shows a fake 100% match):
--   30   base
--   +35  mutual exchange (partner speaks what you learn AND learns what
--        you speak) / +24 partner is fluent in your target language only
--        / +15 partner is learning your native language only
--   +15  shared interests (3 pts each, up to 5)
--   +5   partner is open to helping others
--   +5   both of you are looking for reciprocal exchange
--   +5   partner is online right now
--
-- Returns raw signal columns (shared_interest_count, shared_interest_names,
-- is_online, open_to_help, looking_for_exchange) rather than pre-baked
-- English sentences, so the calling layer (Edge Function / mock service)
-- builds the actual reason strings — keeps language-name lookups in one
-- place instead of duplicating them inside SQL string formatting.
-- ============================================================

create or replace function public.get_discovery_partners(
  p_user_id uuid,
  p_limit    integer default 20,
  p_offset   integer default 0,
  p_practice_language_id uuid default null,
  p_speaker_language_id  uuid default null,
  p_proficiency          text default null,
  p_search_query         text default null,
  p_interest_id          uuid default null,
  p_availability         text default null,
  p_country              text default null
)
returns table (
  id                    uuid,
  username              text,
  display_name          text,
  bio                   text,
  avatar_url            text,
  country               text,
  timezone              text,
  availability          text,
  learning_goals        text,
  is_online             boolean,
  last_seen_at          timestamptz,
  open_to_help          boolean,
  looking_for_exchange  boolean,
  community_intent      text[],
  compatibility_score   integer,
  match_type            text,
  shared_interest_count integer,
  shared_interest_names text[]
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_my_native_lang_ids   uuid[];
  v_my_learning_lang_ids uuid[];
  v_my_interest_ids      uuid[];
  v_my_looking_for_exchange boolean;
begin
  select array_agg(language_id) into v_my_native_lang_ids
  from public.user_languages
  where user_id = p_user_id and type = 'native';

  select array_agg(language_id) into v_my_learning_lang_ids
  from public.user_languages
  where user_id = p_user_id and type = 'learning';

  select array_agg(interest_id) into v_my_interest_ids
  from public.user_interests
  where user_id = p_user_id;

  select looking_for_exchange into v_my_looking_for_exchange
  from public.profiles
  where id = p_user_id;

  return query
  with scored as (
    select
      p.id,
      p.username,
      p.display_name,
      p.bio,
      p.avatar_url,
      p.country,
      p.timezone,
      p.availability,
      p.learning_goals,
      p.is_online,
      p.last_seen_at,
      p.open_to_help,
      p.looking_for_exchange,
      p.community_intent,
      case
        when (
          exists (select 1 from user_languages ul where ul.user_id = p.id and ul.type = 'native' and ul.language_id = any(v_my_learning_lang_ids)) and
          exists (select 1 from user_languages ul where ul.user_id = p.id and ul.type = 'learning' and ul.language_id = any(v_my_native_lang_ids))
        ) then 'mutual_exchange'
        when exists (select 1 from user_languages ul where ul.user_id = p.id and ul.type = 'native' and ul.language_id = any(v_my_learning_lang_ids))
        then 'fluent_partner'
        when exists (select 1 from user_languages ul where ul.user_id = p.id and ul.type = 'learning' and ul.language_id = any(v_my_native_lang_ids))
        then 'can_help'
        else 'general'
      end as match_type,
      coalesce(shared.cnt, 0)::integer as shared_interest_count,
      coalesce(shared.names, array[]::text[]) as shared_interest_names
    from public.profiles p
    left join lateral (
      select
        count(*)::integer as cnt,
        array_agg(i.name order by i.name) as names
      from public.user_interests ui
      join public.interests i on i.id = ui.interest_id
      where ui.user_id = p.id
        and ui.interest_id = any(coalesce(v_my_interest_ids, array[]::uuid[]))
    ) shared on true
    where
      p.id <> p_user_id
      and not exists (
        select 1 from public.blocks b
        where (b.blocker_id = p_user_id and b.blocked_id = p.id)
           or (b.blocker_id = p.id and b.blocked_id = p_user_id)
      )
      and not exists (
        select 1 from public.matches m
        where m.user_id = p_user_id and m.matched_user_id = p.id and m.status in ('skipped', 'connected')
      )
      and p.onboarding_completed = true
      and (
        p_practice_language_id is null or
        exists (select 1 from user_languages ul where ul.user_id = p.id and ul.type = 'native' and ul.language_id = p_practice_language_id)
      )
      and (
        p_speaker_language_id is null or
        exists (select 1 from user_languages ul where ul.user_id = p.id and ul.type = 'learning' and ul.language_id = p_speaker_language_id)
      )
      and (
        p_proficiency is null or
        exists (select 1 from user_languages ul where ul.user_id = p.id and ul.proficiency = p_proficiency)
      )
      and (
        p_interest_id is null or
        exists (select 1 from user_interests ui where ui.user_id = p.id and ui.interest_id = p_interest_id)
      )
      and (
        p_availability is null or p.availability ilike '%' || p_availability || '%'
      )
      and (
        p_country is null or p.country = p_country
      )
      and (
        p_search_query is null or
        p.display_name ilike '%' || p_search_query || '%' or
        p.bio ilike '%' || p_search_query || '%' or
        p.country ilike '%' || p_search_query || '%'
      )
  )
  select
    scored.id, scored.username, scored.display_name, scored.bio, scored.avatar_url,
    scored.country, scored.timezone, scored.availability, scored.learning_goals,
    scored.is_online, scored.last_seen_at, scored.open_to_help, scored.looking_for_exchange,
    scored.community_intent,
    least(
      30
      + case scored.match_type
          when 'mutual_exchange' then 35
          when 'fluent_partner'  then 24
          when 'can_help'        then 15
          else 0
        end
      + least(scored.shared_interest_count, 5) * 3
      + case when scored.open_to_help then 5 else 0 end
      + case when scored.looking_for_exchange and coalesce(v_my_looking_for_exchange, false) then 5 else 0 end
      + case when scored.is_online then 5 else 0 end,
      95
    )::integer as compatibility_score,
    scored.match_type,
    scored.shared_interest_count,
    scored.shared_interest_names
  from scored
  order by
    compatibility_score desc,
    scored.is_online desc,
    scored.last_seen_at desc nulls last
  limit p_limit
  offset p_offset;
end;
$$;
