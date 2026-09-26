-- Production advisor hardening: optimize owner policies and FK lookups.
drop policy if exists "resume owner all" on public.resumes;
create policy "resume owner all" on public.resumes
for all using((select auth.uid())=user_id) with check((select auth.uid())=user_id);

drop policy if exists "revision owner all" on public.resume_revisions;
create policy "revision owner all" on public.resume_revisions
for all using((select auth.uid())=user_id) with check((select auth.uid())=user_id);

create index if not exists resume_revisions_user_id_idx on public.resume_revisions(user_id);
