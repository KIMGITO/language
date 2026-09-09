-- ============================================================
-- Language Exchange — Row Level Security Policies
-- Migration 002: RLS
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.languages enable row level security;
alter table public.interests enable row level security;
alter table public.conversation_topics enable row level security;
alter table public.user_languages enable row level security;
alter table public.user_interests enable row level security;
alter table public.matches enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;
alter table public.notifications enable row level security;

-- ============================================================
-- PROFILES
-- ============================================================
-- Anyone authenticated can view profiles (for discovery)
drop policy if exists "profiles: authenticated can read" on public.profiles;
create policy "profiles: authenticated can read"
  on public.profiles for select
  to authenticated
  using (true);

-- Users can only update their own profile
drop policy if exists "profiles: own update" on public.profiles;
create policy "profiles: own update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- LANGUAGES & INTERESTS & TOPICS (public read, no user writes)
-- ============================================================
drop policy if exists "languages: public read" on public.languages;
create policy "languages: public read"
  on public.languages for select
  to authenticated
  using (true);

drop policy if exists "interests: public read" on public.interests;
create policy "interests: public read"
  on public.interests for select
  to authenticated
  using (true);

drop policy if exists "topics: public read" on public.conversation_topics;
create policy "topics: public read"
  on public.conversation_topics for select
  to authenticated
  using (true);

-- ============================================================
-- USER LANGUAGES
-- ============================================================
drop policy if exists "user_languages: authenticated read" on public.user_languages;
create policy "user_languages: authenticated read"
  on public.user_languages for select
  to authenticated
  using (true);

drop policy if exists "user_languages: own insert" on public.user_languages;
create policy "user_languages: own insert"
  on public.user_languages for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "user_languages: own update" on public.user_languages;
create policy "user_languages: own update"
  on public.user_languages for update
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "user_languages: own delete" on public.user_languages;
create policy "user_languages: own delete"
  on public.user_languages for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- USER INTERESTS
-- ============================================================
drop policy if exists "user_interests: authenticated read" on public.user_interests;
create policy "user_interests: authenticated read"
  on public.user_interests for select
  to authenticated
  using (true);

drop policy if exists "user_interests: own insert" on public.user_interests;
create policy "user_interests: own insert"
  on public.user_interests for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "user_interests: own delete" on public.user_interests;
create policy "user_interests: own delete"
  on public.user_interests for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- MATCHES
-- ============================================================
drop policy if exists "matches: own read" on public.matches;
create policy "matches: own read"
  on public.matches for select
  to authenticated
  using (auth.uid() = user_id or auth.uid() = matched_user_id);

drop policy if exists "matches: own insert" on public.matches;
create policy "matches: own insert"
  on public.matches for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "matches: own update" on public.matches;
create policy "matches: own update"
  on public.matches for update
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- CONVERSATIONS
-- Only members can read a conversation
-- ============================================================
drop policy if exists "conversations: member read" on public.conversations;
create policy "conversations: member read"
  on public.conversations for select
  to authenticated
  using (
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = id
        and cm.user_id = auth.uid()
    )
  );

-- Only authenticated users can create conversations
-- (creation is handled via Edge Function which validates membership)
drop policy if exists "conversations: authenticated insert" on public.conversations;
create policy "conversations: authenticated insert"
  on public.conversations for insert
  to authenticated
  with check (true);

-- ============================================================
-- CONVERSATION MEMBERS
-- ============================================================
drop policy if exists "conv_members: member read" on public.conversation_members;
create policy "conv_members: member read"
  on public.conversation_members for select
  to authenticated
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.conversation_members cm2
      where cm2.conversation_id = conversation_id
        and cm2.user_id = auth.uid()
    )
  );

drop policy if exists "conv_members: authenticated insert" on public.conversation_members;
create policy "conv_members: authenticated insert"
  on public.conversation_members for insert
  to authenticated
  with check (true);

-- ============================================================
-- MESSAGES
-- Only members of the conversation can read/insert
-- ============================================================
drop policy if exists "messages: member read" on public.messages;
create policy "messages: member read"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = messages.conversation_id
        and cm.user_id = auth.uid()
    )
  );

drop policy if exists "messages: member insert" on public.messages;
create policy "messages: member insert"
  on public.messages for insert
  to authenticated
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = conversation_id
        and cm.user_id = auth.uid()
    )
  );

-- Allow read_at update by recipients (mark as read)
drop policy if exists "messages: member update read_at" on public.messages;
create policy "messages: member update read_at"
  on public.messages for update
  to authenticated
  using (
    auth.uid() <> sender_id and
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = messages.conversation_id
        and cm.user_id = auth.uid()
    )
  )
  with check (
    auth.uid() <> sender_id and
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = conversation_id
        and cm.user_id = auth.uid()
    )
  );

-- ============================================================
-- BLOCKS
-- ============================================================
drop policy if exists "blocks: own read" on public.blocks;
create policy "blocks: own read"
  on public.blocks for select
  to authenticated
  using (auth.uid() = blocker_id);

drop policy if exists "blocks: own insert" on public.blocks;
create policy "blocks: own insert"
  on public.blocks for insert
  to authenticated
  with check (auth.uid() = blocker_id);

drop policy if exists "blocks: own delete" on public.blocks;
create policy "blocks: own delete"
  on public.blocks for delete
  to authenticated
  using (auth.uid() = blocker_id);

-- ============================================================
-- REPORTS
-- ============================================================
drop policy if exists "reports: own read" on public.reports;
create policy "reports: own read"
  on public.reports for select
  to authenticated
  using (auth.uid() = reporter_id);

drop policy if exists "reports: own insert" on public.reports;
create policy "reports: own insert"
  on public.reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
drop policy if exists "notifications: own read" on public.notifications;
create policy "notifications: own read"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "notifications: own update" on public.notifications;
create policy "notifications: own update"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- STORAGE POLICIES for 'avatars' bucket
-- ============================================================

-- Anyone can view avatars (public bucket)
drop policy if exists "avatar: public read" on storage.objects;
create policy "avatar: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Authenticated users can upload to their own folder (avatars/<uid>/*)
drop policy if exists "avatar: own upload" on storage.objects;
create policy "avatar: own upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update/delete their own avatars
drop policy if exists "avatar: own update" on storage.objects;
create policy "avatar: own update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatar: own delete" on storage.objects;
create policy "avatar: own delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );
