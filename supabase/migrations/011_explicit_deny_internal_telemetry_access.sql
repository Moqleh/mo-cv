-- Explicit deny policies for internal telemetry/security tables.
-- These tables are server-only; service_role bypasses RLS while anon/authenticated are denied.
drop policy if exists "deny direct client access to ai_usage" on public.ai_usage;
create policy "deny direct client access to ai_usage"
on public.ai_usage
for all
to anon, authenticated
using (false)
with check (false);

drop policy if exists "deny direct client access to content_moderation_events" on public.content_moderation_events;
create policy "deny direct client access to content_moderation_events"
on public.content_moderation_events
for all
to anon, authenticated
using (false)
with check (false);
