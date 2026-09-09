-- ============================================================
-- Migration 005: OAuth-aware profile creation
--
-- Email/password signups store the name under raw_user_meta_data
-- ->>'display_name' (set explicitly by our RegisterPage). Social
-- providers populate different keys instead:
--   Google   -> full_name, name, avatar_url, picture
--   Apple    -> name may be entirely absent after first consent
--   Facebook -> name, picture (nested object on the Graph API,
--               but Supabase flattens it to a plain avatar_url string)
--
-- This replaces handle_new_user() with a version that checks all of
-- those keys and also seeds avatar_url from the provider photo.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  meta          jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  resolved_name text;
  resolved_pic  text;
begin
  resolved_name := coalesce(
    nullif(meta->>'display_name', ''),
    nullif(meta->>'full_name', ''),
    nullif(meta->>'name', ''),
    nullif(meta->>'given_name', ''),
    split_part(new.email, '@', 1)
  );

  resolved_pic := coalesce(
    nullif(meta->>'avatar_url', ''),
    nullif(meta->>'picture', '')
  );

  insert into public.profiles (id, display_name, username, avatar_url)
  values (
    new.id,
    resolved_name,
    lower(regexp_replace(resolved_name, '[^a-zA-Z0-9_]', '_', 'g'))
      || '_' || floor(random() * 9000 + 1000)::text,
    resolved_pic
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Trigger already exists from 001_schema.sql and points at this function
-- by name, so no need to re-create it — CREATE OR REPLACE above is enough.

-- ------------------------------------------------------------
-- Backfill: for any existing OAuth users whose profile predates
-- this migration and is still missing an avatar, pull it in now.
-- ------------------------------------------------------------
update public.profiles p
set avatar_url = coalesce(
  nullif(u.raw_user_meta_data->>'avatar_url', ''),
  nullif(u.raw_user_meta_data->>'picture', '')
)
from auth.users u
where u.id = p.id
  and p.avatar_url is null;
