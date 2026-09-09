-- ============================================================
-- Language Exchange — Secure SQL Functions (called from Edge Functions)
-- Migration 004: Database Functions
-- ============================================================

-- ============================================================
-- FUNCTION: get_discovery_partners
-- Returns a list of profiles suitable for the current user to discover,
-- with compatibility scoring. Called from the get-matches Edge Function.
-- Excludes: blocked users, already-connected/skipped matches, self.
-- ============================================================
create or replace function public.get_discovery_partners(
  p_user_id uuid,
  p_limit    integer default 20,
  p_offset   integer default 0,
  p_practice_language_id uuid default null,
  p_speaker_language_id  uuid default null,
  p_proficiency          text default null,
  p_search_query         text default null
)
returns table (
  id                   uuid,
  username             text,
  display_name         text,
  bio                  text,
  avatar_url           text,
  country              text,
  timezone             text,
  availability         text,
  learning_goals       text,
  is_online            boolean,
  last_seen_at         timestamptz,
  open_to_help         boolean,
  looking_for_exchange boolean,
  community_intent     text[],
  compatibility_score  integer,
  match_type           text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_my_native_lang_ids  uuid[];
  v_my_learning_lang_ids uuid[];
begin
  -- Get current user's language IDs
  select array_agg(language_id) into v_my_native_lang_ids
  from public.user_languages
  where user_id = p_user_id and type = 'native';

  select array_agg(language_id) into v_my_learning_lang_ids
  from public.user_languages
  where user_id = p_user_id and type = 'learning';

  return query
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
    -- Compatibility scoring
    (
      70 +
      -- Priority 1: mutual exchange (+26)
      case when (
        exists (select 1 from user_languages ul where ul.user_id = p.id and ul.type = 'native' and ul.language_id = any(v_my_learning_lang_ids)) and
        exists (select 1 from user_languages ul where ul.user_id = p.id and ul.type = 'learning' and ul.language_id = any(v_my_native_lang_ids))
      ) then 26
      -- Priority 2: partner speaks what I learn (+18)
      when exists (select 1 from user_languages ul where ul.user_id = p.id and ul.type = 'native' and ul.language_id = any(v_my_learning_lang_ids))
      then 18
      -- Priority 3: partner learns what I speak (+12)
      when exists (select 1 from user_languages ul where ul.user_id = p.id and ul.type = 'learning' and ul.language_id = any(v_my_native_lang_ids))
      then 12
      else 0 end
    )::integer as compatibility_score,
    -- Match type label
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
    end as match_type
  from public.profiles p
  where
    -- Exclude self
    p.id <> p_user_id
    -- Exclude blocked users (either direction)
    and not exists (
      select 1 from public.blocks b
      where (b.blocker_id = p_user_id and b.blocked_id = p.id)
         or (b.blocker_id = p.id and b.blocked_id = p_user_id)
    )
    -- Exclude already skipped matches
    and not exists (
      select 1 from public.matches m
      where m.user_id = p_user_id and m.matched_user_id = p.id and m.status = 'skipped'
    )
    -- Exclude already connected matches
    and not exists (
      select 1 from public.matches m
      where m.user_id = p_user_id and m.matched_user_id = p.id and m.status = 'connected'
    )
    -- Only show completed profiles
    and p.onboarding_completed = true
    -- Optional filter: partner speaks language I want to practice
    and (
      p_practice_language_id is null or
      exists (
        select 1 from user_languages ul
        where ul.user_id = p.id and ul.type = 'native' and ul.language_id = p_practice_language_id
      )
    )
    -- Optional filter: partner is learning a language I speak
    and (
      p_speaker_language_id is null or
      exists (
        select 1 from user_languages ul
        where ul.user_id = p.id and ul.type = 'learning' and ul.language_id = p_speaker_language_id
      )
    )
    -- Optional filter: proficiency
    and (
      p_proficiency is null or
      exists (
        select 1 from user_languages ul
        where ul.user_id = p.id and ul.proficiency = p_proficiency
      )
    )
    -- Optional text search on display_name, bio, country
    and (
      p_search_query is null or
      p.display_name ilike '%' || p_search_query || '%' or
      p.bio ilike '%' || p_search_query || '%' or
      p.country ilike '%' || p_search_query || '%'
    )
  order by
    compatibility_score desc,
    p.is_online desc,
    p.last_seen_at desc nulls last
  limit p_limit
  offset p_offset;
end;
$$;

-- ============================================================
-- FUNCTION: get_or_create_conversation
-- Atomically finds or creates a 1-on-1 conversation.
-- ============================================================
create or replace function public.get_or_create_conversation(
  p_user_a uuid,
  p_user_b uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conversation_id uuid;
begin
  -- Validate users are not blocked
  if exists (
    select 1 from public.blocks b
    where (b.blocker_id = p_user_a and b.blocked_id = p_user_b)
       or (b.blocker_id = p_user_b and b.blocked_id = p_user_a)
  ) then
    raise exception 'Cannot start conversation with blocked user';
  end if;

  -- Check if conversation already exists between these two users
  select cm1.conversation_id into v_conversation_id
  from public.conversation_members cm1
  inner join public.conversation_members cm2
    on cm1.conversation_id = cm2.conversation_id
   and cm2.user_id = p_user_b
  where cm1.user_id = p_user_a
  limit 1;

  if v_conversation_id is not null then
    return v_conversation_id;
  end if;

  -- Create new conversation
  insert into public.conversations default values
  returning id into v_conversation_id;

  -- Add both members
  insert into public.conversation_members (conversation_id, user_id)
  values (v_conversation_id, p_user_a),
         (v_conversation_id, p_user_b);

  return v_conversation_id;
end;
$$;

-- ============================================================
-- FUNCTION: connect_partner
-- Creates a match record with status 'connected' and opens a conversation.
-- ============================================================
create or replace function public.connect_partner(
  p_user_id   uuid,
  p_partner_id uuid,
  p_score     integer default 80
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_match_id         uuid;
  v_conversation_id  uuid;
begin
  -- Upsert match row
  insert into public.matches (user_id, matched_user_id, compatibility_score, status)
  values (p_user_id, p_partner_id, p_score, 'connected')
  on conflict (user_id, matched_user_id) do update
    set status = 'connected', updated_at = now()
  returning id into v_match_id;

  -- Get or create conversation
  v_conversation_id := public.get_or_create_conversation(p_user_id, p_partner_id);

  return jsonb_build_object(
    'match_id',         v_match_id,
    'conversation_id',  v_conversation_id
  );
end;
$$;

-- ============================================================
-- FUNCTION: block_and_cleanup
-- Blocks a user and removes any active conversations/matches.
-- ============================================================
create or replace function public.block_and_cleanup(
  p_blocker_id uuid,
  p_blocked_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conv_id uuid;
begin
  -- Insert block (ignore duplicate)
  insert into public.blocks (blocker_id, blocked_id)
  values (p_blocker_id, p_blocked_id)
  on conflict do nothing;

  -- Update match statuses
  update public.matches
  set status = 'skipped'
  where (user_id = p_blocker_id and matched_user_id = p_blocked_id)
     or (user_id = p_blocked_id and matched_user_id = p_blocker_id);

  -- Remove shared conversation members so blocked user can't see messages
  for v_conv_id in
    select cm1.conversation_id
    from public.conversation_members cm1
    inner join public.conversation_members cm2
      on cm1.conversation_id = cm2.conversation_id
     and cm2.user_id = p_blocked_id
    where cm1.user_id = p_blocker_id
  loop
    delete from public.conversation_members
    where conversation_id = v_conv_id
      and user_id = p_blocked_id;
  end loop;
end;
$$;

-- ============================================================
-- FUNCTION: get_unread_count
-- Returns total unread message count for a user across all conversations.
-- ============================================================
create or replace function public.get_unread_count(p_user_id uuid)
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.messages m
  inner join public.conversation_members cm
    on cm.conversation_id = m.conversation_id
   and cm.user_id = p_user_id
  where m.sender_id <> p_user_id
    and m.read_at is null;
$$;

-- ============================================================
-- FUNCTION: delete_user_account
-- Soft-deletes a user — anonymises profile data and removes sensitive info.
-- The auth.users record is deleted separately via Admin API from Edge Function.
-- ============================================================
create or replace function public.delete_user_account(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Verify caller is deleting their own account
  if auth.uid() <> p_user_id then
    raise exception 'Unauthorized';
  end if;

  -- Remove user from all conversations
  delete from public.conversation_members where user_id = p_user_id;

  -- Remove matches
  delete from public.matches
  where user_id = p_user_id or matched_user_id = p_user_id;

  -- Remove blocks
  delete from public.blocks
  where blocker_id = p_user_id or blocked_id = p_user_id;

  -- Remove notifications
  delete from public.notifications where user_id = p_user_id;

  -- Anonymise profile (do not delete, to keep message history intact)
  update public.profiles
  set
    display_name = 'Deleted User',
    bio          = '',
    avatar_url   = null,
    username     = 'deleted_' || p_user_id::text,
    is_online    = false,
    onboarding_completed = false
  where id = p_user_id;
end;
$$;

-- ============================================================
-- FUNCTION: update_user_presence
-- Called by client periodically to mark user as online/offline.
-- ============================================================
create or replace function public.update_user_presence(
  p_user_id uuid,
  p_is_online boolean
)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set is_online    = p_is_online,
      last_seen_at = case when p_is_online = false then now() else last_seen_at end
  where id = p_user_id;
$$;
