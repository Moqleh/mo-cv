-- Harden browser-facing resume data access.
revoke all on table public.resumes from anon;
revoke all on table public.resume_revisions from anon;

revoke all on table public.resumes from authenticated;
grant select, insert, update, delete on table public.resumes to authenticated;

revoke all on table public.resume_revisions from authenticated;
grant select, insert, delete on table public.resume_revisions to authenticated;

drop policy if exists "resume owner all" on public.resumes;
create policy "resume owner all" on public.resumes
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "revision owner all" on public.resume_revisions;
create policy "revision owner all" on public.resume_revisions
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke execute on function public.update_resume_if_version(text,bigint,text,text,text,jsonb) from public, anon;
grant execute on function public.update_resume_if_version(text,bigint,text,text,text,jsonb) to authenticated;
revoke execute on function public.capture_resume_revision() from public, anon;
revoke execute on function public.prune_resume_revisions() from public, anon;
revoke execute on function public.touch_resume_updated_at() from public, anon;
