-- ============================================================
-- Language Exchange — Full Database Schema
-- Migration 001: Tables, Triggers, Indexes
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for fast text search

-- ============================================================
-- LANGUAGES (seed data table)
-- ============================================================
create table if not exists public.languages (
  id          uuid primary key default uuid_generate_v4(),
  code        text not null unique,   -- ISO 639-1 code e.g. 'en'
  name        text not null,          -- English name e.g. 'English'
  native_name text,                   -- Native name e.g. 'English'
  flag        text,                   -- Emoji flag e.g. '🇬🇧'
  created_at  timestamptz not null default now()
);

-- ============================================================
-- INTERESTS (seed data table)
-- ============================================================
create table if not exists public.interests (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null unique,
  category   text,                  -- e.g. 'Arts', 'Sports', 'Technology'
  created_at timestamptz not null default now()
);

-- ============================================================
-- CONVERSATION TOPICS (seed data table)
-- ============================================================
create table if not exists public.conversation_topics (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  prompt      text not null,
  category    text not null,         -- e.g. 'Culture', 'Travel', 'Food'
  difficulty  text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  language_id uuid references public.languages(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- PROFILES
-- One-to-one with auth.users, auto-created on signup via trigger
-- ============================================================
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  username            text unique,
  display_name        text not null default '',
  bio                 text not null default '',
  avatar_url          text,
  country             text not null default '',
  timezone            text not null default '',
  availability        text,
  learning_goals      text,
  community_intent    text[] default '{}',   -- ['practice','help_others','language_exchange']
  open_to_help        boolean not null default true,
  looking_for_exchange boolean not null default true,
  onboarding_completed boolean not null default false,
  is_online           boolean not null default false,
  last_seen_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- USER LANGUAGES
-- ============================================================
create table if not exists public.user_languages (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  type        text not null check (type in ('native', 'learning')),
  proficiency text not null check (proficiency in (
    'Beginner','Elementary','Intermediate','Upper Intermediate','Advanced','Fluent','Native'
  )),
  created_at  timestamptz not null default now(),
  unique(user_id, language_id, type)
);

-- ============================================================
-- USER INTERESTS
-- ============================================================
create table if not exists public.user_interests (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  interest_id uuid not null references public.interests(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, interest_id)
);

-- ============================================================
-- MATCHES
-- ============================================================
create table if not exists public.matches (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  matched_user_id     uuid not null references public.profiles(id) on delete cascade,
  compatibility_score integer not null default 70 check (compatibility_score between 0 and 100),
  match_type          text check (match_type in ('mutual_exchange','fluent_partner','can_help','general')),
  status              text not null default 'suggested' check (status in ('suggested','connected','saved','skipped','pending')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique(user_id, matched_user_id)
);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
create table if not exists public.conversations (
  id         uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- CONVERSATION MEMBERS
-- ============================================================
create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  joined_at       timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

-- ============================================================
-- MESSAGES
-- ============================================================
create table if not exists public.messages (
  id               uuid primary key default uuid_generate_v4(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  sender_id        uuid not null references public.profiles(id) on delete cascade,
  content          text not null check (char_length(content) between 1 and 4000),
  is_topic_starter boolean not null default false,
  topic_title      text,
  topic_category   text,
  read_at          timestamptz,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- BLOCKS
-- ============================================================
create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

-- ============================================================
-- REPORTS
-- ============================================================
create table if not exists public.reports (
  id               uuid primary key default uuid_generate_v4(),
  reporter_id      uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid not null references public.profiles(id) on delete cascade,
  reason           text not null check (reason in (
    'Harassment','Spam','Inappropriate content','Fake profile','Hate or abuse','Other'
  )),
  description      text,
  status           text not null default 'pending' check (status in ('pending','reviewed','resolved')),
  created_at       timestamptz not null default now(),
  check (reporter_id <> reported_user_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       text not null check (type in ('message','match','system')),
  title      text not null,
  body       text not null,
  read       boolean not null default false,
  link       text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- profiles
create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_profiles_is_online on public.profiles(is_online);
create index if not exists idx_profiles_display_name_trgm on public.profiles using gin(display_name gin_trgm_ops);

-- user_languages
create index if not exists idx_user_languages_user_id on public.user_languages(user_id);
create index if not exists idx_user_languages_language_id on public.user_languages(language_id);
create index if not exists idx_user_languages_type on public.user_languages(type);

-- user_interests
create index if not exists idx_user_interests_user_id on public.user_interests(user_id);
create index if not exists idx_user_interests_interest_id on public.user_interests(interest_id);

-- matches
create index if not exists idx_matches_user_id on public.matches(user_id);
create index if not exists idx_matches_matched_user_id on public.matches(matched_user_id);
create index if not exists idx_matches_status on public.matches(status);

-- conversation_members
create index if not exists idx_conv_members_user_id on public.conversation_members(user_id);
create index if not exists idx_conv_members_conv_id on public.conversation_members(conversation_id);

-- messages
create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
create index if not exists idx_messages_sender_id on public.messages(sender_id);
create index if not exists idx_messages_created_at on public.messages(created_at desc);

-- blocks
create index if not exists idx_blocks_blocker_id on public.blocks(blocker_id);
create index if not exists idx_blocks_blocked_id on public.blocks(blocked_id);

-- notifications
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    lower(regexp_replace(
      coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
      '[^a-zA-Z0-9_]', '_', 'g'
    )) || '_' || floor(random() * 9000 + 1000)::text
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at on profiles
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists matches_updated_at on public.matches;
create trigger matches_updated_at
  before update on public.matches
  for each row execute procedure public.set_updated_at();

drop trigger if exists conversations_updated_at on public.conversations;
create trigger conversations_updated_at
  before update on public.conversations
  for each row execute procedure public.set_updated_at();

-- Auto-update conversation.updated_at when a new message is inserted
create or replace function public.update_conversation_on_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.conversations
  set updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists message_updates_conversation on public.messages;
create trigger message_updates_conversation
  after insert on public.messages
  for each row execute procedure public.update_conversation_on_message();

-- Auto-create notification when a new message is inserted
create or replace function public.notify_on_new_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  sender_name text;
  recipient_id uuid;
begin
  -- Get sender's display name
  select display_name into sender_name
  from public.profiles where id = new.sender_id;

  -- Notify all OTHER members of the conversation
  for recipient_id in
    select user_id from public.conversation_members
    where conversation_id = new.conversation_id
      and user_id <> new.sender_id
  loop
    insert into public.notifications (user_id, type, title, body, link)
    values (
      recipient_id,
      'message',
      sender_name || ' sent you a message',
      left(new.content, 100),
      '/messages'
    );
  end loop;

  return new;
end;
$$;

drop trigger if exists message_notification on public.messages;
create trigger message_notification
  after insert on public.messages
  for each row execute procedure public.notify_on_new_message();

-- ============================================================
-- STORAGE BUCKET for avatars
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,                    -- public read
  5242880,                 -- 5MB max
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do nothing;
