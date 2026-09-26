-- Keep only the 50 newest immutable revisions for each resume.
create or replace function public.prune_resume_revisions() returns trigger language plpgsql security invoker set search_path=public as $$ begin
 delete from public.resume_revisions
 where resume_id=new.resume_id and id in (
  select id from public.resume_revisions where resume_id=new.resume_id
  order by created_at desc,id desc offset 50
 );
 return new;
end $$;
drop trigger if exists resume_revisions_prune on public.resume_revisions;
create trigger resume_revisions_prune after insert on public.resume_revisions for each row execute function public.prune_resume_revisions();

-- Harden existing functions against search_path changes.
alter function public.touch_resume_updated_at() set search_path=public;
alter function public.update_resume_if_version(text,bigint,text,text,text,jsonb) set search_path=public;
alter function public.capture_resume_revision() set search_path=public;
