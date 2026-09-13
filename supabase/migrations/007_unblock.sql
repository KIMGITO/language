-- ============================================================
-- Migration 007: Unblock
--
-- block_and_cleanup (004_functions.sql) had no inverse — a client could
-- delete their own row from `blocks` directly (RLS already permits that),
-- but that alone leaves the match between the two users stuck at
-- status = 'skipped' forever, since get_discovery_partners excludes any
-- match with that status. The blocked person would never resurface in
-- discovery even after being unblocked.
--
-- Resetting that match status requires touching the *other* user's match
-- row too (block_and_cleanup updates both directions), which RLS's
-- "matches: own update" policy won't allow for the blocker to touch (it
-- only permits auth.uid() = user_id on that row). Hence this needs the
-- same security-definer treatment as block_and_cleanup, with an explicit
-- auth.uid() check standing in for the RLS check it bypasses.
-- ============================================================

create or replace function public.unblock_user(
  p_blocker_id uuid,
  p_blocked_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is distinct from p_blocker_id then
    raise exception 'Not authorized to unblock on behalf of another user';
  end if;

  delete from public.blocks
  where blocker_id = p_blocker_id and blocked_id = p_blocked_id;

  -- Give both people a clean slate in discovery — only resets matches that
  -- were skipped as a side effect of the block, restoring them to
  -- 'suggested' rather than deleting history.
  update public.matches
  set status = 'suggested'
  where status = 'skipped'
    and (
      (user_id = p_blocker_id and matched_user_id = p_blocked_id) or
      (user_id = p_blocked_id and matched_user_id = p_blocker_id)
    );
end;
$$;
